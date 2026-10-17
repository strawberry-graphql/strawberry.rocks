import { StatusIndicator } from "./status-indicator";
import { PYODIDE_VERSION } from "./strawberry/pyodideVersion";
import { VersionSelector } from "./version-selector";

export const StatusBar = ({
  strawberryVersion,
  onStrawberryVersionChange,
}: {
  strawberryVersion: string;
  onStrawberryVersionChange: (version: string) => void;
}) => (
  <footer className="flex h-8 shrink-0 items-center gap-3 border-t bg-chrome pr-2 pl-4 text-xs text-muted-foreground">
    <StatusIndicator />

    <div className="ml-auto flex items-center gap-1">
      <span className="hidden sm:inline">Pyodide {PYODIDE_VERSION}</span>
      <span className="hidden h-3 w-px bg-border sm:block" />
      <VersionSelector
        name="strawberry-graphql"
        defaultVersion={strawberryVersion}
        onVersionSelected={onStrawberryVersionChange}
      />
    </div>
  </footer>
);
