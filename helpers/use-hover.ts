import { useEffect, useRef } from "react";

export const useHover = ({
  selector,
  onMouseOver,
  onMouseOut,
}: {
  selector?: string;
  onMouseOver: (element: HTMLElement) => void;
  onMouseOut: () => void;
}) => {
  const ref = useRef<any>(null);

  const handleMouseOver = (event: MouseEvent) => {
    if (
      !selector ||
      (event.target && (event.target as HTMLElement).matches(selector))
    ) {
      onMouseOver(event.target as HTMLElement);
    }
  };
  const handleMouseOut = (event: MouseEvent) => {
    onMouseOut();
  };

  useEffect(() => {
    const node = ref.current as HTMLElement;
    if (node) {
      node.addEventListener("mouseover", handleMouseOver);
      node.addEventListener("mouseout", handleMouseOut);
      return () => {
        node.removeEventListener("mouseover", handleMouseOver);
        node.removeEventListener("mouseout", handleMouseOut);
      };
    }
  }, [ref.current]);

  return { ref };
};
