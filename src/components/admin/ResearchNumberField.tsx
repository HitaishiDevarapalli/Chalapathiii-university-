import React, { useEffect, useState } from "react";

export function ResearchNumberField({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (value: number) => void }) {
  const [draft, setDraft] = useState(String(value));
  useEffect(() => setDraft(String(value)), [value]);
  const commit = () => {
    const number = draft.trim() ? Number(draft) : value;
    const next = Math.max(min, Math.min(max, Number.isFinite(number) ? Math.round(number) : value));
    setDraft(String(next)); onChange(next);
  };
  return <label>{label}<div className="research-image-number">
    <input type="number" min={min} max={max} value={draft} onChange={event => setDraft(event.target.value)} onBlur={commit} onKeyDown={event => { if (event.key === "Enter") { event.preventDefault(); event.currentTarget.blur(); } }} />
    <input type="range" min={min} max={max} value={value} aria-label={`${label} slider`} onChange={event => onChange(Number(event.target.value))} />
  </div></label>;
}
