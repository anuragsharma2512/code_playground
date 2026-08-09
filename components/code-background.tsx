import { cn } from "@/lib/utils";

interface CodeBackgroundProps {
  className?: string;
}

export function CodeBackground({ className }: CodeBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "code-background pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      <div className="code-background__grid" />
      <div className="code-background__scan code-background__scan--one" />
      <div className="code-background__scan code-background__scan--two" />
      <div className="code-background__syntax code-background__syntax--one" />
      <div className="code-background__syntax code-background__syntax--two" />
    </div>
  );
}
