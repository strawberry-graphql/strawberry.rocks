"use client";

import cx from "classnames";
import React, { ReactNode, useContext, useEffect } from "react";
import { createPortal } from "react-dom";

export type Note = {
  id: string;
  element: HTMLElement;
};

type Context = {
  currentNote: Note | null;
  setCurrentNote: (note: Note | null) => void;
};

export const NotesContext = React.createContext<Context>({
  currentNote: null,
  setCurrentNote: () => {},
});

export const CodeNotes = ({
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
