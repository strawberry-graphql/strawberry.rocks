import type {
  PythonError,
  StrawberryExceptionDetails,
} from "../strawberry/pyodide-context";

export const LineLink = ({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className="font-mono text-xs underline decoration-dotted underline-offset-2 hover:text-foreground"
  >
    {label}
  </button>
);

/** Renders `backtick` quoted parts of Strawberry's messages as code */
const WithCode = ({ text }: { text: string }) => (
  <>
    {text.split(/`([^`]+)`/).map((part, index) =>
      index % 2 === 1 ? (
        <code key={index} className="font-mono text-[0.9em] whitespace-nowrap">
          {part}
        </code>
      ) : (
        part
      )
    )}
  </>
);

const Traceback = ({ traceback }: { traceback: string }) => (
  <pre className="overflow-x-auto rounded-md bg-muted p-3 font-mono text-xs leading-relaxed">
    {traceback}
  </pre>
);

/** Strawberry's own errors, rendered like its CLI output */
const StrawberryExceptionView = ({
  error,
  details,
  onJumpToCode,
}: {
  error: PythonError;
  details: StrawberryExceptionDetails;
  onJumpToCode: (line: number) => void;
}) => {
  const location = details.location;

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-semibold text-destructive">
          <WithCode text={details.title} />
        </p>
        {location ? (
          <p className="mt-0.5 text-muted-foreground">
            <LineLink
              label={`schema.py:${location.line}`}
              onClick={() => onJumpToCode(location.line)}
            />
          </p>
        ) : null}
      </div>

      {location && details.snippet.length > 0 ? (
        <pre className="overflow-x-auto rounded-md bg-muted py-3 font-mono text-xs leading-relaxed">
          {details.snippet.map(({ line, text }) => {
            const isErrorLine = line === location.line;

            return (
              <div key={line}>
                <div className={isErrorLine ? "bg-destructive/10" : undefined}>
                  <span className="inline-block w-10 pr-3 text-right text-muted-foreground select-none">
                    {line}
                  </span>
                  {text}
                </div>
                {isErrorLine ? (
                  <div className="text-destructive">
                    <span className="inline-block w-10 select-none" />
                    {" ".repeat(location.column - 1)}
                    {"^".repeat(
                      Math.max(1, location.end_column - location.column)
                    )}
                    {details.annotation ? ` ${details.annotation}` : null}
                  </div>
                ) : null}
              </div>
            );
          })}
        </pre>
      ) : null}

      {details.suggestion ? (
        <p className="text-sm">
          <WithCode text={details.suggestion} />
        </p>
      ) : null}

      {details.documentation_url ? (
        <a
          href={details.documentation_url}
          target="_blank"
          rel="noreferrer"
          className="inline-block text-xs font-medium text-strawberry hover:underline"
        >
          Read more about this error →
        </a>
      ) : null}

      {error.traceback ? (
        <details className="text-xs text-muted-foreground">
          <summary className="cursor-pointer select-none">Traceback</summary>
          <div className="mt-2">
            <Traceback traceback={error.traceback} />
          </div>
        </details>
      ) : null}
    </div>
  );
};

export const PythonErrorView = ({
  error,
  onJumpToCode,
}: {
  error: PythonError;
  onJumpToCode: (line: number) => void;
}) =>
  error.strawberry ? (
    <StrawberryExceptionView
      error={error}
      details={error.strawberry}
      onJumpToCode={onJumpToCode}
    />
  ) : (
    <div className="space-y-2">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-mono text-sm font-semibold text-destructive">
          {error.type}
        </span>
        {error.line ? (
          <span className="text-muted-foreground">
            <LineLink
              label={`schema.py:${error.line}`}
              onClick={() => onJumpToCode(error.line!)}
            />
          </span>
        ) : null}
      </div>
      {error.traceback ? (
        <Traceback traceback={error.traceback} />
      ) : (
        <p className="text-sm">{error.message}</p>
      )}
    </div>
  );
