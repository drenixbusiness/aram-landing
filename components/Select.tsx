"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";

export type SelectOption = { value: string; label: string };

type Props = {
  id: string;
  name: string;
  labelId: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  /** Adds a filter box and shows each option's value as a hint (e.g. state codes). */
  searchable?: boolean;
  searchPlaceholder?: string;
  invalid?: boolean;
  describedBy?: string;
};

export default function Select({
  id,
  name,
  labelId,
  options,
  value,
  onChange,
  placeholder = "Select",
  icon,
  searchable,
  searchPlaceholder = "Search",
  invalid,
  describedBy,
}: Props) {
  const [open, setOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const typeahead = useRef({ text: "", timer: 0 });
  const listId = useId();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q) || o.value.toLowerCase() === q);
  }, [options, query]);

  const selected = options.find((o) => o.value === value);
  const optionId = (i: number) => `${listId}-opt-${i}`;

  function openList() {
    const r = triggerRef.current!.getBoundingClientRect();
    const below = window.innerHeight - r.bottom;
    setDropUp(below < 300 && r.top > below);
    setQuery("");
    setActive(Math.max(0, options.findIndex((o) => o.value === value)));
    setOpen(true);
  }

  function close(focusTrigger = true) {
    setOpen(false);
    if (focusTrigger) triggerRef.current?.focus();
  }

  function choose(opt: SelectOption | undefined) {
    if (!opt) return;
    onChange(opt.value);
    close();
  }

  // Focus the search box or list once open.
  useEffect(() => {
    if (!open) return;
    (searchable ? searchRef.current : listRef.current)?.focus({ preventScroll: true });
  }, [open, searchable]);

  // Keep the active option in view.
  useEffect(() => {
    if (!open) return;
    document.getElementById(optionId(active))?.scrollIntoView({ block: "nearest" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, open]);

  // Close on outside press.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  function onListKey(e: React.KeyboardEvent) {
    const last = filtered.length - 1;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActive((i) => Math.min(last, i + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActive((i) => Math.max(0, i - 1));
        break;
      case "Home":
        if (!searchable) { e.preventDefault(); setActive(0); }
        break;
      case "End":
        if (!searchable) { e.preventDefault(); setActive(last); }
        break;
      case "Enter":
        e.preventDefault();
        choose(filtered[active]);
        break;
      case " ":
        if (!searchable) { e.preventDefault(); choose(filtered[active]); }
        break;
      case "Escape":
        e.preventDefault();
        close();
        break;
      case "Tab":
        close(false);
        break;
      default:
        if (!searchable && e.key.length === 1) {
          // Type-ahead: jump to the first option starting with the typed letters.
          const t = typeahead.current;
          window.clearTimeout(t.timer);
          t.text += e.key.toLowerCase();
          t.timer = window.setTimeout(() => (t.text = ""), 600);
          const i = filtered.findIndex((o) => o.label.toLowerCase().startsWith(t.text));
          if (i >= 0) setActive(i);
        }
    }
  }

  function onTriggerKey(e: React.KeyboardEvent) {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
      e.preventDefault();
      openList();
    }
  }

  return (
    <div ref={rootRef} className={`select${open ? " is-open" : ""}${dropUp ? " is-up" : ""}`}>
      <input type="hidden" name={name} value={value} />
      <button
        ref={triggerRef}
        id={id}
        type="button"
        className={`select-trigger${icon ? " has-icon" : ""}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-labelledby={`${labelId} ${id}`}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onClick={() => (open ? close() : openList())}
        onKeyDown={onTriggerKey}
      >
        {icon && <span className="field-icon">{icon}</span>}
        <span className={selected ? "select-value" : "select-value is-placeholder"}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown className="select-chevron" aria-hidden />
      </button>

      {open && (
        <div className="select-pop">
          {searchable && (
            <div className="select-search">
              <Search aria-hidden />
              <input
                ref={searchRef}
                type="text"
                role="combobox"
                aria-expanded="true"
                aria-controls={listId}
                aria-activedescendant={filtered[active] ? optionId(active) : undefined}
                aria-label={searchPlaceholder}
                placeholder={searchPlaceholder}
                autoComplete="off"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onKeyDown={onListKey}
              />
            </div>
          )}
          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            tabIndex={searchable ? -1 : 0}
            aria-labelledby={labelId}
            aria-activedescendant={!searchable && filtered[active] ? optionId(active) : undefined}
            onKeyDown={searchable ? undefined : onListKey}
          >
            {filtered.map((o, i) => (
              <li
                key={o.value}
                id={optionId(i)}
                role="option"
                aria-selected={o.value === value}
                className={i === active ? "is-active" : undefined}
                onPointerMove={() => setActive(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(o)}
              >
                <span>{o.label}</span>
                {searchable && <span className="select-hint">{o.value}</span>}
                <Check className="select-check" aria-hidden />
              </li>
            ))}
            {filtered.length === 0 && <li className="select-empty">No matches</li>}
          </ul>
        </div>
      )}
    </div>
  );
}
