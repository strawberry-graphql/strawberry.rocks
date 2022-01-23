import cx from "classnames";
import GithubSlugger from "github-slugger";
import { createElement, ReactNode, useContext, useEffect } from "react";
import { createPortal } from "react-dom";

import Image from "next/image";
import type { ImageProps } from "next/image";

import { useHover } from "~/helpers/use-hover";

import { AdditionalResources } from "./additional-resources";
import { NotesContext } from "./code-notes";
import { CopyToClipboard } from "./copy-to-clipboard";
import { SplitCodeView } from "./split-code-view";

const DocsLink = ({
  children,
  href,
  ...props
}: {
  href?: string;
  className?: string;
  children: React.ReactNode;
}) => {
  href = href ? href.replace(/.md(#.*)?$/, "$1") : "";

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

const DocsImage = ({ src, ...props }: { src: string } & ImageProps) => (
  // eslint-disable-next-line jsx-a11y/alt-text
  <Image className="border-2 border-red-500 max-w-full" src={src} {...props} />
);

const heading =
  (level: 1 | 2 | 3 | 4 | 5 | 6) =>
  // eslint-disable-next-line react/display-name
  ({ children }: { children: ReactNode }) => {
    if (level >= 4) {
      // Any levels that are h4 and above have different styles
      return createElement(
        `h${level}`,
        {
          className: cx("mt-8 mb-4 text-md font-bold"),
        },
        children
      );
    }

    return createElement(
      `h${level}`,
      {
        className: cx("my-8", {
          "text-3xl": level === 1,
          "text-2xl": level === 2,
          "text-xl": level === 3,
          underline: level > 1,
        }),
      },
      children
    );
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

const Pre = ({
  children,
  ...props
}: {
  children: ReactNode;
  className?: string;
}) => {
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

  const getCode = () => {
    return ref.current.querySelector("code").innerText;
  };

  return (
    <pre
      ref={ref}
      className={cx(
        "mb-8 font-mono overflow-x-auto border-2 border-red-500 p-6",
        "bg-white dark:text-white dark:bg-gray-800",
        "relative",
        props.className
      )}
    >
      <div className="absolute top-3 right-3 z-10">
        <CopyToClipboard getText={getCode} />
      </div>
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
  const { currentNote, setCurrentNote } = useContext(NotesContext);

  useEffect(() => {
    const removeNote = () => {
      setCurrentNote(null);
    };

    window.addEventListener("scroll", removeNote);

    return () => {
      window.removeEventListener("scroll", removeNote);
    };
  }, [setCurrentNote]);

  if (currentNote === null) {
    return null;
  }

  const boundingBox = currentNote.element.getBoundingClientRect();

  return createPortal(
    <div
      className={cx("fixed p-4 border-2 border-red-500 bg-gray-100", {
        hidden: currentNote.id !== props.id,
      })}
      style={{
        top: boundingBox.top + boundingBox.height + 4 + "px",
        left: boundingBox.left + "px",
      }}
      {...props}
    >
      <p className="text-gray-600">{children}</p>
    </div>,
    currentNote.element
  );
};

const BaseBlock = ({
  heading,
  color,
  children,
}: {
  heading: string;
  color: "green" | "blue" | "yellow";
  children: ReactNode;
}) => (
  <div
    className={cx("border-l-4 shadow-sm mb-4 overflow-auto", {
      "border-green-500": color === "green",
      "border-blue-500": color === "blue",
      "border-yellow-500": color === "yellow",
    })}
  >
    <div
      className={cx("py-2 px-3 mb-2 font-bold", {
        "bg-green-100 dark:bg-green-500": color === "green",
        "bg-blue-100 dark:bg-blue-500": color === "blue",
        "bg-yellow-100 dark:bg-yellow-500": color === "yellow",
      })}
    >
      {heading}
    </div>
    <div className="px-3">{children}</div>
  </div>
);

const NoteBlock = ({ children }: { children: ReactNode }) => (
  <BaseBlock color="blue" heading="📝 Note">
    {children}
  </BaseBlock>
);

const TipBlock = ({ children }: { children: ReactNode }) => (
  <BaseBlock color="green" heading="💡 Tip">
    {children}
  </BaseBlock>
);

const WarningBlock = ({ children }: { children: ReactNode }) => (
  <BaseBlock color="yellow" heading="⚠️ Warning">
    {children}
  </BaseBlock>
);

const BlockQuote = ({ children }: { children: ReactNode }) => (
  <blockquote className="border-l-4 border-gray-300 pt-2 px-3 overflow-auto italic opacity-80 mb-4">
    {children}
  </blockquote>
);

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
  blockquote: BlockQuote,
  AdditionalResources,
  img: DocsImage,
  CodeNotes,
  SplitCodeView,
  Note: NoteBlock,
  Tip: TipBlock,
  Warning: WarningBlock,
};

export default theme;
