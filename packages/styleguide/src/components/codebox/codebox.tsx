"use client";

import { offset, useFloating } from "@floating-ui/react-dom";
import clsx from "clsx";
import { useCallback, useEffect, useRef, useState } from "react";

export const Codebox = ({
  children,
  notes,
  ...props
}: {
  children: React.ReactNode;
  notes?: { text: string; id: string }[];
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [currentNote, setCurrentNote] = useState<string | null>(null);
  const { x, y, strategy, refs } = useFloating({
    placement: "bottom-start",
    middleware: [offset(10)],
  });

  const handleMouseEnter = useCallback(
    (e: MouseEvent) => {
      if (e.currentTarget) {
        // @ts-ignore
        const noteId = e.currentTarget.dataset.nodeId!;

        // find first span with data-node-id
        const span = ref.current?.querySelector<HTMLSpanElement>(
          `span[data-node-id="${noteId}"]`
        );

        if (span) {
          refs.setReference(span);
        }

        setCurrentNote(noteId);
      }
    },
    [refs]
  );

  const handleMouseLeave = useCallback(() => {
    setCurrentNote(null);
  }, []);

  useEffect(() => {
    // add event listener to all span with data-node-id
    const spans =
      ref.current?.querySelectorAll<HTMLSpanElement>("span[data-node-id]");

    if (spans) {
      spans.forEach((span) => {
        span.addEventListener("mouseenter", handleMouseEnter);
        span.addEventListener("mouseleave", handleMouseLeave);
      });
    }

    return () => {
      if (spans) {
        spans.forEach((span) => {
          span.removeEventListener("mouseenter", handleMouseEnter);
          span.removeEventListener("mouseleave", handleMouseLeave);
        });
      }
    };
  }, [handleMouseEnter, handleMouseLeave]);

  const visibleNote = notes?.find((note) => note.id == currentNote);

  return (
    <div ref={ref} className="mb-8">
      <div
        className={clsx(
          "text-white border-transparency-light dark:border-g-900 bg-g-900 dark:bg-transparency-dark",
          "border rounded-[12px] overflow-hidden"
        )}
      >
        <div className="codebox">
          <pre {...props}>{children}</pre>
        </div>
      </div>

      {visibleNote && (
        <div
          className="z-10 mr-24 max-w-lg rounded-[12px] p-8 bg-code-orange"
          ref={refs.setFloating}
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
          }}
        >
          {visibleNote.text}
        </div>
      )}
    </div>
  );
};
