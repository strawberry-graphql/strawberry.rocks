"use client";

import { ReactNode, useCallback } from "react";

export const FaqDetails = ({ children }: { children: ReactNode }) => {
  const onClick = useCallback(
    async (e: React.MouseEvent<HTMLDetailsElement>) => {
      const el = e.currentTarget;
      const event = {
        name: "faq-open",
        url: window.location.href,
        domain: "strawberry.rocks",
        props: {
          title: el.querySelector("summary")?.textContent ?? "title-missing",
        },
      };

      // event is called before the details element's status is updated
      if (el.open === false) {
        event.name = "faq-open";
      } else {
        event.name = "faq-close";
      }

      await fetch("/api/event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      });
    },
    []
  );

  return (
    <details className="mb-4" onClick={onClick}>
      {children}
    </details>
  );
};
