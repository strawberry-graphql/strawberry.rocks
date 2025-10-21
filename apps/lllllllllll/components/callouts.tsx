import { Callout as FumadocsCallout } from "fumadocs-ui/components/callout";
import type { ReactNode } from "react";

interface CalloutProps {
  children: ReactNode;
}

export function Note({ children }: CalloutProps) {
  return <FumadocsCallout type="info">{children}</FumadocsCallout>;
}

export function Tip({ children }: CalloutProps) {
  return <FumadocsCallout type="tip">{children}</FumadocsCallout>;
}

export function Warning({ children }: CalloutProps) {
  return <FumadocsCallout type="warn">{children}</FumadocsCallout>;
}

// CodeNotes component (custom styling for code notes)
export function CodeNotes({
  id,
  children,
}: {
  id?: string;
  children: ReactNode;
}) {
  return (
    <div className="mt-2 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100">
      {children}
    </div>
  );
}

// CodeGrid component for side-by-side code blocks
export function CodeGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 md:grid-cols-2">{children}</div>;
}
