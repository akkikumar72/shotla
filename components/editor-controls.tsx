"use client";
import { useEffect, useId, useRef, useState } from "react";

export function Slider({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit = "",
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}) {
  const id = useId();
  return (
    <div className="control">
      <div className="control-label">
        <label htmlFor={id}>{label}</label>
        <output htmlFor={id}>
          {value}
          {unit}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={
          {
            "--range-fill": `${((value - min) / (max - min)) * 100}%`,
          } as React.CSSProperties
        }
      />
    </div>
  );
}
export function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="toggle-row">
      <span>{label}</span>
      <input
        type="checkbox"
        role="switch"
        aria-checked={checked}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="toggle-track" aria-hidden="true" />
    </label>
  );
}
export function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  const id = useId();
  return (
    <div className="control">
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
export function Segments({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div className="control">
      <span>{label}</span>
      <div className="segments" role="group" aria-label={label}>
        {options.map((o) => (
          <button
            key={o}
            aria-pressed={value === o}
            onClick={() => onChange(o)}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
export function Color({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const id = useId();
  const [hex, setHex] = useState(value);
  const committed = useRef(value);
  useEffect(() => {
    setHex(value);
    committed.current = value;
  }, [value]);
  const commit = (next: string) => {
    setHex(next);
    if (/^#[a-f\d]{6}$/i.test(next) && next !== committed.current) {
      committed.current = next;
      onChange(next);
    }
  };
  return (
    <div className="control">
      <label htmlFor={id}>{label}</label>
      <div className="color-field">
        <input
          id={id}
          type="color"
          value={value}
          onInput={(e) => commit(e.currentTarget.value)}
          onChange={(e) => commit(e.target.value)}
        />
        <input
          className="hex-input"
          aria-label={`${label} hex`}
          value={hex}
          maxLength={7}
          spellCheck={false}
          onChange={(e) => commit(e.target.value)}
          onBlur={() => setHex(value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
          }}
        />
        <span className="muted">100%</span>
      </div>
    </div>
  );
}
export function Section({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="panel-section">
      <div className="section-heading">
        <h3>{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}
