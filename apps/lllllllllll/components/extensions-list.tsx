import Link from "next/link";

interface Extension {
  href: string;
  title: string;
  summary: string;
  tags: string[];
}

const extensions: Extension[] = [
  {
    href: "/docs/strawberry/extensions/apollo-tracing",
    title: "Apollo Tracing",
    summary: "Add Apollo tracing to your GraphQL server.",
    tags: ["tracing"],
  },
  {
    href: "/docs/strawberry/extensions/opentelemetry",
    title: "OpenTelemetry",
    summary: "Add OpenTelemetry tracing to your GraphQL server.",
    tags: ["tracing"],
  },
  {
    href: "/docs/strawberry/extensions/sentry-tracing",
    title: "Sentry Tracing",
    summary: "Add Sentry tracing to your GraphQL server.",
    tags: ["tracing"],
  },
  {
    href: "/docs/strawberry/extensions/datadog",
    title: "Datadog",
    summary: "Add Datadog tracing to your GraphQL server.",
    tags: ["tracing"],
  },
  {
    href: "/docs/strawberry/extensions/pyinstrument",
    title: "Pyinstrument",
    summary: "Profile your GraphQL queries with Pyinstrument.",
    tags: ["profiling"],
  },
  {
    href: "/docs/strawberry/extensions/parser-cache",
    title: "Parser Cache",
    summary: "Cache parsed GraphQL queries to improve performance.",
    tags: ["performance"],
  },
  {
    href: "/docs/strawberry/extensions/validation-cache",
    title: "Validation Cache",
    summary: "Cache GraphQL query validation to improve performance.",
    tags: ["performance"],
  },
  {
    href: "/docs/strawberry/extensions/query-depth-limiter",
    title: "Query Depth Limiter",
    summary: "Limit the depth of GraphQL queries.",
    tags: ["security"],
  },
  {
    href: "/docs/strawberry/extensions/max-tokens-limiter",
    title: "Max Tokens Limiter",
    summary: "Limit the number of tokens in GraphQL queries.",
    tags: ["security"],
  },
  {
    href: "/docs/strawberry/extensions/max-aliases-limiter",
    title: "Max Aliases Limiter",
    summary: "Limit the number of aliases in GraphQL queries.",
    tags: ["security"],
  },
  {
    href: "/docs/strawberry/extensions/disable-validation",
    title: "Disable Validation",
    summary: "Disable GraphQL query validation.",
    tags: ["validation"],
  },
  {
    href: "/docs/strawberry/extensions/disable-introspection",
    title: "Disable Introspection",
    summary: "Disable GraphQL introspection queries.",
    tags: ["security"],
  },
  {
    href: "/docs/strawberry/extensions/add-validation-rules",
    title: "Add Validation Rules",
    summary: "Add custom validation rules to your GraphQL server.",
    tags: ["validation"],
  },
  {
    href: "/docs/strawberry/extensions/mask-errors",
    title: "Mask Errors",
    summary: "Mask errors in your GraphQL responses.",
    tags: ["security"],
  },
  {
    href: "/docs/strawberry/extensions/input-mutation",
    title: "Input Mutation",
    summary: "Automatically generate input types for mutations.",
    tags: ["mutation"],
  },
];

function ExtensionCard({ extension }: { extension: Extension }) {
  return (
    <Link
      href={extension.href}
      className="group flex h-full flex-col justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary hover:bg-accent"
    >
      <div>
        <h4 className="mb-2 text-lg font-semibold group-hover:text-primary">
          {extension.title}
        </h4>
        <p className="text-sm text-muted-foreground">{extension.summary}</p>
      </div>

      <ul className="mt-3 flex flex-wrap gap-1">
        {extension.tags.map((tag) => (
          <li key={tag}>
            <span className="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {tag}
            </span>
          </li>
        ))}
      </ul>
    </Link>
  );
}

export function ExtensionsList() {
  return (
    <div className="not-prose my-6">
      <ul className="grid gap-4 md:grid-cols-2">
        {extensions.map((extension) => (
          <li key={extension.href} className="min-w-0">
            <ExtensionCard extension={extension} />
          </li>
        ))}
      </ul>
    </div>
  );
}
