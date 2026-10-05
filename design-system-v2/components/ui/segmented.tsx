import { cn } from "@/lib/utils";

/** Control segmentado: un grupo de botones con aria-pressed. Es la forma de «cambiar de estado» en las demos. */
export function Segmented<T extends string>({ label, value, options, onChange, className }: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  className?: string;
}) {
  return (
    <div className={cn("vz-seg", className)} role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o.value} type="button" aria-pressed={o.value === value} onClick={() => onChange(o.value)}>{o.label}</button>
      ))}
    </div>
  );
}
