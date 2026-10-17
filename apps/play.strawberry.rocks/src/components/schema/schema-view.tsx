import { CodeEditor } from "../editor/editor";
import { SchemaExplorer } from "./schema-explorer";
import clsx from "clsx";
import type { GraphQLSchema } from "graphql";
import { useState } from "react";

const VIEWS = ["Explorer", "SDL"] as const;

export const SchemaView = ({
  schema,
  sdl,
}: {
  /** null when the SDL couldn't be parsed by graphql-js */
  schema: GraphQLSchema | null;
  sdl: string | null;
}) => {
  const [view, setView] = useState<(typeof VIEWS)[number]>("Explorer");

  if (!sdl) {
    return (
      <p className="p-4 text-sm text-muted-foreground">
        The schema shows up here once the code runs successfully.
      </p>
    );
  }

  const activeView = schema ? view : "SDL";

  return (
    <div className="flex h-full flex-col">
      <div className="flex gap-1 border-b px-3 py-1.5">
        {VIEWS.map((option) => (
          <button
            key={option}
            type="button"
            disabled={!schema && option === "Explorer"}
            onClick={() => setView(option)}
            className={clsx(
              "rounded-md px-2 py-0.5 text-xs font-medium disabled:opacity-50",
              activeView === option
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="min-h-0 flex-1">
        {activeView === "Explorer" && schema ? (
          <SchemaExplorer schema={schema} />
        ) : (
          <CodeEditor source={sdl} language="graphql" readOnly />
        )}
      </div>
    </div>
  );
};
