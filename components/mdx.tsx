import cx from "classnames";
import GithubSlugger from "github-slugger";
import {
  createElement,
  ReactChild,
  ReactElement,
  ReactNode,
  useContext,
  useRef,
} from "react";
import { createPortal } from "react-dom";

import { useHover } from "~/helpers/use-hover";

import { AdditionalResources } from "./additional-resources";
import { NotesContext } from "./code-notes";
import { GraphQLExample } from "./graphql-example";
import { SchemaExample } from "./schema-example";

const DocsLink = ({
  children,
  href,
  ...props
}: {
  href?: string;
  className?: string;
  children: React.ReactNode;
}) => {
  href = href ? href.replace(/.md$/, "") : "";

  return (
    <a
      href={href}
      {...props}
      className={cx(props.className, {
        underline: !href.startsWith("#") && href,
      })}
    >
      {children}
    </a>
  );
};

const DocsImage = ({ src, ...props }: { src: string }) => (
  <img className="border-2 border-red-500 max-w-full" src={src} {...props} />
);

// const CustomPrism = ({
//   className,
//   children,
// }: {
//   className: string;
//   children: string;
// }) => {
//   const [language]: string[] = className
//     ? className.replace(/language-/, "").split(" ")
//     : [""];
//   if (language === "graphql+response") {
//     const [query, response] = children.split("---");
//     if (!query || !response) {
//       throw new Error("Invalid content for language `graphql+response`");
//     }
//     return <GraphQLExample query={query} response={response} />;
//   }

//   if (language === "python+schema") {
//     const [python, schema] = children.split("---");
//     if (!python || !schema) {
//       throw new Error("Invalid content for language `python+schema`");
//     }
//     return <SchemaExample python={python} schema={schema} />;
//   }

//   return <CodeBlock language={language}>{children}</CodeBlock>;
// };

// eslint-disable-next-line react/display-name
const heading =
  (level: 1 | 2 | 3 | 4 | 5 | 6) =>
  ({ children }: { children: ReactNode }) => {
    return createElement(`h${level}`, {
      className: cx("font-medium my-8", {
        "text-3xl": level === 1,
        "text-2xl": level === 2,
        "text-xl": level >= 3,
        underline: level > 1,
      }),
      children,
    });
  };

const Paragraph = ({ children }: { children: ReactNode }) => (
  <p className="mb-4">{children}</p>
);

const UnorderedList = ({ children, ...props }: { children: ReactNode }) => (
  <ul className="mb-4 list-disc list-inside" {...props}>
    {children}
  </ul>
);

const TableHeader = ({ children, ...props }: { children: string }) => {
  const slugger = new GithubSlugger();
  const slug = slugger.slug(children);

  return (
    <th
      {...props}
      className={cx("text-left", "p-2", "border-b", "border-current", {
        "w-full": slug === "description",
        "whitespace-nowrap": slug === "parameter-name" || slug === "type",
        "pr-8": slug === "parameter-name" || slug === "type",
      })}
    >
      {children}
    </th>
  );
};

const TableCell = ({ children, ...props }: { children: string }) => {
  return (
    <td
      {...props}
      className={cx("text-left", "p-2", "border-b", "border-current", "w-20")}
    >
      {children}
    </td>
  );
};

const TableRow = ({ children }: { children: ReactNode }) => (
  <tr className="even:bg-indigo-100 dark:even:bg-indigo-900">{children}</tr>
);

const Table = ({ children }: { children: ReactNode }) => (
  <div className="max-w-full mb-4 overflow-x-scroll">
    <table className="w-full border-collapse">{children}</table>
  </div>
);

const Separator = () => (
  <div className="my-16 relative text-center">
    <hr className="border-t border-red-500" />

    <span className="absolute -top-6 text-lg p-2 bg-white dark:bg-gray-800">
      🍓
    </span>
  </div>
);

const Pre = ({ children }: { children: ReactNode }) => {
  const ctx = useContext(NotesContext);

  const { ref } = useHover({
    selector: ".code-note",
    onMouseOver: (el) => {
      const noteId = el.dataset.noteId;

      if (noteId) {
        ctx.setCurrentNote({ id: noteId, element: el });
      }
    },
    onMouseOut: () => {
      ctx.setCurrentNote(null);
    },
  });

  return (
    <pre
      ref={ref}
      className="mb-8 font-mono overflow-x-auto border-2 border-red-500 p-6 bg-white dark:text-white dark:bg-gray-800"
    >
      {children}
    </pre>
  );
};

const Code = ({ children }: { children: ReactNode }) => {
  return <code className="p-1">{children}</code>;
};

const CodeNotes = ({
  children,
  ...props
}: {
  children: ReactNode;
  id: string;
}) => {
  const { currentNote } = useContext(NotesContext);

  if (currentNote === null) {
    return null;
  }

  const boundingBox = currentNote.element.getBoundingClientRect();

  return createPortal(
    <div
      className={cx("absolute p-4 border-2 border-red-500 bg-gray-100", {
        hidden: currentNote.id !== props.id,
      })}
      style={{
        top: boundingBox.top + window.scrollY + boundingBox.height + 4 + "px",
        left: boundingBox.left + "px",

      }}
      {...props}
    >
      <p className="text-gray-600">{children}</p>
    </div>,
    currentNote.element
  );
};

const theme = {
  h1: heading(1),
  h2: heading(2),
  h3: heading(3),
  h4: heading(4),
  h5: heading(5),
  h6: heading(6),
  p: Paragraph,
  ul: UnorderedList,
  table: Table,
  th: TableHeader,
  td: TableCell,
  tr: TableRow,
  hr: Separator,
  // eslint-disable-next-line react/display-name
  pre: Pre,
  inlineCode: Code,
  a: DocsLink,
  AdditionalResources,
  img: DocsImage,
  CodeNotes,
};

export default theme;
