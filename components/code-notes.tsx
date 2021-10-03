import React from "react";

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
