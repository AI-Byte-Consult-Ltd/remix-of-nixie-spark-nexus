import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

export const RangeSlider = ({
  value,
  min,
  max,
  step = 0.05,
  onChange,
}: {
  value: number[];
  min: number;
  max: number;
  step?: number;
  onChange: (v: number[]) => void;
}) => (
  <SliderPrimitive.Root
    className="relative flex w-full touch-none select-none items-center py-2"
    value={value}
    min={min}
    max={max}
    step={step}
    minStepsBetweenThumbs={1}
    onValueChange={onChange}
  >
    <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-secondary">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    {value.map((_, i) => (
      <SliderPrimitive.Thumb
        key={i}
        className="block h-4 w-4 rounded-full border-2 border-primary bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
    ))}
  </SliderPrimitive.Root>
);

export const Field = ({ label, extra, children }: { label: string; extra?: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between gap-2 text-xs">
      <span className="font-medium text-foreground">{label}</span>
      {extra && <span className="text-muted-foreground tabular-nums">{extra}</span>}
    </div>
    {children}
  </div>
);

export const Segmented = <T extends string>({
  value,
  options,
  onChange,
  size = "md",
}: {
  value: T;
  options: { value: T; label: React.ReactNode }[];
  onChange: (v: T) => void;
  size?: "sm" | "md";
}) => (
  <div className="inline-flex flex-wrap rounded-full border border-border p-0.5 bg-background">
    {options.map((o) => (
      <button
        key={o.value}
        type="button"
        onClick={() => onChange(o.value)}
        className={cn(
          "rounded-full transition-colors inline-flex items-center gap-1",
          size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm",
          value === o.value ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
        )}
      >
        {o.label}
      </button>
    ))}
  </div>
);

export const Swatches = ({ colors, value, onChange }: { colors: string[]; value: string; onChange: (c: string) => void }) => (
  <div className="flex flex-wrap items-center gap-2">
    {colors.map((c) => (
      <button
        key={c}
        type="button"
        aria-label={c}
        onClick={() => onChange(c)}
        className={cn("w-6 h-6 rounded-full border-2", value === c ? "border-primary ring-2 ring-primary/30" : "border-border")}
        style={{ background: c }}
      />
    ))}
  </div>
);
