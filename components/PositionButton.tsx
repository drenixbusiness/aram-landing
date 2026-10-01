"use client";

import { SELECT_POSITION_EVENT, type Position } from "@/lib/site";

export default function PositionButton({ position }: { position: Position }) {
  return (
    <a
      href="#apply"
      className="btn btn--primary card-btn"
      onClick={() => window.dispatchEvent(new CustomEvent(SELECT_POSITION_EVENT, { detail: position }))}
    >
      Apply for this role
    </a>
  );
}
