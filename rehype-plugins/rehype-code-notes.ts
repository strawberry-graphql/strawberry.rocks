import { toString } from "hast-util-to-string";
import { visit } from "unist-util-visit";

const noteRegex = /^#( +)((\S+ ?)+)/;
const noteStartRegex = /^#( +)(\^+)/;

const wrapChild = (
  node: any,
  currentIndex: number,
  start: number,
  end: number,
  parentNode: any,
  noteId: string | number
) => {
  let text = "";

  if (node.type === "element") {
    node.children.map((child: any) => {
      text += wrapChild(child, currentIndex, start, end, node, noteId);

      currentIndex += text.length;
    });
  } else if (node.type === "text") {
    text = node.value;

    node.value = text;

    if (currentIndex + text.length >= start) {
      // go through each character and wrap it
      // TODO: this could be smarter and not wrap every character
      // but I'm lazy and this works for now :D
      const children = [];

      for (let i = 0; i < text.length; i++) {
        const char = text[i];

        if (currentIndex + i >= start && currentIndex + i < end) {
          children.push({
            type: "element",
            tagName: "span",
            properties: {
              "data-node-id": noteId,
            },
            children: [
              {
                type: "text",
                value: char,
              },
            ],
          });
        } else {
          children.push({
            type: "text",
            value: char,
          });
        }
      }

      parentNode.children = children;
    }

    currentIndex += text.length;
  }

  return text;
};

const wrapNode = (
  node: any,
  start: number,
  end: number,
  noteId: string | number
) => {
  // assuming node is a single line
  let currentIndex = 0;

  node.children.map((child: any, index: number) => {
    const text = wrapChild(child, currentIndex, start, end, node, noteId);

    const textLength = text.length;

    currentIndex += textLength;
  });
};

export const RehypeCodeNotes = () => {
  const visitor = (node: any, index: number, parentNode: any) => {
    if (node.tagName === "code") {
      let currentNote = {
        id: 1,
        text: "",
      };

      const notes: (typeof currentNote)[] = [];

      let insideCodeNote = false;
      let previousChildren: any = null;
      let childBeforeNote: any = null;
      const newChildren: any = [];

      let start = 0;
      let end = 0;

      node.children.forEach((child: any) => {
        const text = toString(child);

        const noteMatch = text.match(noteRegex);

        if (noteMatch) {
          const startMatch = text.match(noteStartRegex);

          if (startMatch) {
            insideCodeNote = true;

            start = startMatch[1].length + 1;
            end = start + noteMatch[2].length;

            childBeforeNote = previousChildren;
          } else {
            const noteText = noteMatch[2];

            currentNote.text = noteText;
          }
        } else {
          if (insideCodeNote) {
            wrapNode(childBeforeNote, start, end, currentNote.id);

            insideCodeNote = false;
            childBeforeNote = null;
            start = 0;
            end = 0;

            notes.push(currentNote);
          } else {
            newChildren.push(child);

            currentNote = {
              id: currentNote.id + 1,
              text: "",
            };
          }
        }

        if (text.trim()) {
          previousChildren = child;
        }
      });

      node.children = [...newChildren];

      // there should be a better way to pass non scalar
      // values to the component
      parentNode.properties = {
        notes: JSON.stringify(notes),
      };
    }
  };

  return () => {
    return (tree: any) => {
      // @ts-ignore
      visit(tree, "element", visitor);
    };
  };
};