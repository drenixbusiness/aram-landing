"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";

export type AccordionItem = { question: string; answer: React.ReactNode };

export default function Accordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div className="accordion">
      {items.map((item, i) => {
        const open = openIndex === i;
        const btnId = `${baseId}-btn-${i}`;
        const panelId = `${baseId}-panel-${i}`;
        return (
          <div className="acc-item" key={item.question} data-reveal style={{ "--d": i } as React.CSSProperties}>
            <h3 className="acc-heading">
              <button
                type="button"
                id={btnId}
                className="acc-trigger"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? null : i)}
              >
                <span>{item.question}</span>
                <Plus className="acc-icon" aria-hidden />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              className={`acc-panel${open ? " is-open" : ""}`}
              inert={!open}
            >
              <div className="acc-panel-inner">
                <p>{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
