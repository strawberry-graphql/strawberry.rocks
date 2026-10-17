import clsx from "clsx";
import {
  getNamedType,
  isEnumType,
  isInputObjectType,
  isInterfaceType,
  isObjectType,
  isScalarType,
  isUnionType,
  type GraphQLArgument,
  type GraphQLField,
  type GraphQLInputField,
  type GraphQLNamedType,
  type GraphQLSchema,
  type GraphQLType,
} from "graphql";
import { ChevronLeft } from "lucide-react";
import { useMemo, useState } from "react";

const typeKind = (type: GraphQLNamedType) =>
  isObjectType(type)
    ? "type"
    : isInterfaceType(type)
    ? "interface"
    : isUnionType(type)
    ? "union"
    : isEnumType(type)
    ? "enum"
    : isInputObjectType(type)
    ? "input"
    : "scalar";

const KIND_LABELS: Record<ReturnType<typeof typeKind>, string> = {
  type: "Object types",
  interface: "Interfaces",
  union: "Unions",
  enum: "Enums",
  input: "Input types",
  scalar: "Scalars",
};

type Navigate = (typeName: string) => void;

/** Renders a type reference like `[User!]!`, with the named type as a link */
const TypeRef = ({
  type,
  onNavigate,
}: {
  type: GraphQLType;
  onNavigate: Navigate;
}) => {
  const named = getNamedType(type);
  const [before, after] = type.toString().split(named.name);

  return (
    <span className="font-mono">
      {before}
      <button
        type="button"
        onClick={() => onNavigate(named.name)}
        className="text-amber-700 hover:underline dark:text-amber-400"
      >
        {named.name}
      </button>
      {after}
    </span>
  );
};

const Description = ({
  text,
  clamp = false,
}: {
  text?: string | null;
  /** Limits long descriptions, e.g. of built-in scalars, in lists */
  clamp?: boolean;
}) =>
  text ? (
    <p
      className={clsx(
        "mt-0.5 text-xs whitespace-pre-line text-muted-foreground",
        clamp && "line-clamp-2"
      )}
    >
      {text}
    </p>
  ) : null;

const Deprecation = ({ reason }: { reason?: string | null }) =>
  reason ? (
    <p className="mt-0.5 text-xs text-amber-700 dark:text-amber-400">
      Deprecated: {reason}
    </p>
  ) : null;

const Args = ({
  args,
  onNavigate,
}: {
  args: readonly GraphQLArgument[];
  onNavigate: Navigate;
}) =>
  args.length > 0 ? (
    <>
      (
      {args.map((arg, index) => (
        <span key={arg.name}>
          {index > 0 ? ", " : null}
          <span className="text-sky-700 dark:text-sky-400">
            {arg.name}
          </span>: <TypeRef type={arg.type} onNavigate={onNavigate} />
        </span>
      ))}
      )
    </>
  ) : null;

const FieldRow = ({
  field,
  onNavigate,
}: {
  field: GraphQLField<unknown, unknown> | GraphQLInputField;
  onNavigate: Navigate;
}) => (
  <li className="px-4 py-2">
    <div className="font-mono text-sm">
      <span className="font-medium">{field.name}</span>
      {"args" in field ? (
        <Args args={field.args} onNavigate={onNavigate} />
      ) : null}
      : <TypeRef type={field.type} onNavigate={onNavigate} />
      {"defaultValue" in field && field.defaultValue !== undefined ? (
        <span className="text-muted-foreground">
          {" "}
          = {JSON.stringify(field.defaultValue)}
        </span>
      ) : null}
    </div>
    <Description text={field.description} />
    <Deprecation reason={field.deprecationReason} />
  </li>
);

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section>
    <h3 className="bg-muted/50 px-4 py-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
      {title}
    </h3>
    <ul className="divide-y">{children}</ul>
  </section>
);

const TypeLinks = ({
  title,
  types,
  onNavigate,
}: {
  title: string;
  types: readonly GraphQLNamedType[];
  onNavigate: Navigate;
}) =>
  types.length > 0 ? (
    <Section title={title}>
      {types.map((type) => (
        <li key={type.name} className="px-4 py-2 text-sm">
          <TypeRef type={type} onNavigate={onNavigate} />
          <Description text={type.description} clamp />
        </li>
      ))}
    </Section>
  ) : null;

const TypeDetails = ({
  schema,
  type,
  onNavigate,
}: {
  schema: GraphQLSchema;
  type: GraphQLNamedType;
  onNavigate: Navigate;
}) => (
  <div>
    <div className="px-4 py-3">
      <p className="font-mono text-sm">
        <span className="text-muted-foreground">{typeKind(type)} </span>
        <span className="font-semibold">{type.name}</span>
      </p>
      <Description text={type.description} />
    </div>

    {isObjectType(type) || isInterfaceType(type) ? (
      <>
        <Section title="Fields">
          {Object.values(type.getFields()).map((field) => (
            <FieldRow key={field.name} field={field} onNavigate={onNavigate} />
          ))}
        </Section>
        <TypeLinks
          title="Implements"
          types={type.getInterfaces()}
          onNavigate={onNavigate}
        />
      </>
    ) : null}

    {isInterfaceType(type) ? (
      <TypeLinks
        title="Implementations"
        types={schema.getPossibleTypes(type)}
        onNavigate={onNavigate}
      />
    ) : null}

    {isInputObjectType(type) ? (
      <Section title="Fields">
        {Object.values(type.getFields()).map((field) => (
          <FieldRow key={field.name} field={field} onNavigate={onNavigate} />
        ))}
      </Section>
    ) : null}

    {isUnionType(type) ? (
      <TypeLinks
        title="Possible types"
        types={type.getTypes()}
        onNavigate={onNavigate}
      />
    ) : null}

    {isEnumType(type) ? (
      <Section title="Values">
        {type.getValues().map((value) => (
          <li key={value.name} className="px-4 py-2">
            <span className="font-mono text-sm font-medium">{value.name}</span>
            <Description text={value.description} />
            <Deprecation reason={value.deprecationReason} />
          </li>
        ))}
      </Section>
    ) : null}

    {isScalarType(type) && type.specifiedByURL ? (
      <p className="px-4 py-2 text-xs text-muted-foreground">
        Specified by{" "}
        <a href={type.specifiedByURL} className="underline">
          {type.specifiedByURL}
        </a>
      </p>
    ) : null}
  </div>
);

const SchemaOverview = ({
  schema,
  search,
  onNavigate,
}: {
  schema: GraphQLSchema;
  search: string;
  onNavigate: Navigate;
}) => {
  const types = Object.values(schema.getTypeMap()).filter(
    (type) => !type.name.startsWith("__")
  );
  const term = search.trim().toLowerCase();

  if (term) {
    const matchingTypes = types.filter((type) =>
      type.name.toLowerCase().includes(term)
    );
    const matchingFields = types.flatMap((type) =>
      isObjectType(type) || isInterfaceType(type) || isInputObjectType(type)
        ? Object.values(type.getFields())
            .filter((field) => field.name.toLowerCase().includes(term))
            .map((field) => ({ type, field }))
        : []
    );

    if (matchingTypes.length === 0 && matchingFields.length === 0) {
      return (
        <p className="p-4 text-sm text-muted-foreground">
          Nothing matches “{search}”.
        </p>
      );
    }

    return (
      <>
        <TypeLinks
          title="Types"
          types={matchingTypes}
          onNavigate={onNavigate}
        />
        {matchingFields.length > 0 ? (
          <Section title="Fields">
            {matchingFields.map(({ type, field }) => (
              <li
                key={`${type.name}.${field.name}`}
                className="px-4 py-2 font-mono text-sm"
              >
                <button
                  type="button"
                  onClick={() => onNavigate(type.name)}
                  className="hover:underline"
                >
                  {type.name}.<span className="font-medium">{field.name}</span>
                </button>
                : <TypeRef type={field.type} onNavigate={onNavigate} />
              </li>
            ))}
          </Section>
        ) : null}
      </>
    );
  }

  const roots = [
    schema.getQueryType(),
    schema.getMutationType(),
    schema.getSubscriptionType(),
  ].filter((type) => type != null);
  const rootNames = new Set(roots.map((type) => type.name));

  return (
    <>
      <TypeLinks title="Root types" types={roots} onNavigate={onNavigate} />
      {(Object.keys(KIND_LABELS) as (keyof typeof KIND_LABELS)[]).map(
        (kind) => (
          <TypeLinks
            key={kind}
            title={KIND_LABELS[kind]}
            types={types.filter(
              (type) => typeKind(type) === kind && !rootNames.has(type.name)
            )}
            onNavigate={onNavigate}
          />
        )
      )}
    </>
  );
};

export const SchemaExplorer = ({ schema }: { schema: GraphQLSchema }) => {
  const [history, setHistory] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const current = history.at(-1);
  // A type can disappear when the schema changes
  const type = useMemo(
    () => (current ? schema.getType(current) : undefined),
    [schema, current]
  );

  const navigate = (typeName: string) => {
    setHistory((history) => [...history, typeName]);
    setSearch("");
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b px-4 py-2">
        {type ? (
          <>
            <button
              type="button"
              onClick={() => setHistory((history) => history.slice(0, -1))}
              className="flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
              {history.at(-2) ?? "Schema"}
            </button>
          </>
        ) : (
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search types and fields"
            className="w-full bg-transparent text-sm outline-hidden placeholder:text-muted-foreground"
          />
        )}
      </div>
      <div className="min-h-0 flex-1 overflow-auto">
        {type ? (
          <TypeDetails schema={schema} type={type} onNavigate={navigate} />
        ) : (
          <SchemaOverview
            schema={schema}
            search={search}
            onNavigate={navigate}
          />
        )}
      </div>
    </div>
  );
};
