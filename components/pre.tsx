"use client";

import cx from "classnames";
import { ReactNode, useContext } from "react";

import { useHover } from "~/helpers/use-hover";

import { NotesContext } from "./code-notes";
import { CopyToClipboard } from "./copy-to-clipboard";

export const Pre = ({
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
