"use client";

import { useEffect, useRef, useCallback } from "react";

export const GlowEffect = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  const [width, height] = [672, 557];

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!svgRef.current) return;

      const { clientX, clientY } = e;

      const top = clientY - height / 2;
      const left = clientX - width / 2;

      svgRef.current.animate(
        { transform: `translate(${left}px, ${top}px)` },
        {
          duration: 3000,
          fill: "forwards",
          // easing: "ease-in-out",
        }
      );
    },
    [width, height]
  );

  useEffect(() => {
    if (svgRef.current && "animate" in svgRef.current) {
      window.addEventListener("mousemove", handleMouseMove);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, [handleMouseMove]);

  return (
    <div className="fixed inset-0 -z-10">
      <svg
        ref={svgRef}
        width="672"
        height="557"
        viewBox="0 0 672 557"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute left-0 top-0 transform-gpu"
      >
        <path
          opacity="0.2"
          d="M113.713 240.714C113.713 151.755 229.977 61.4378 293.208 61.4378C310.206 92.6754 360.657 155.15 426.472 155.15C508.74 155.15 416.953 1 580.81 1C744.667 1 648.121 284.175 580.81 351.404L426.472 505.554C327.885 604.02 367.318 532.717 113.713 505.554C-139.891 478.391 113.713 329.673 113.713 240.714Z"
          fill="#F7393D"
          stroke="black"
        />
      </svg>

      <div className="absolute inset-0 backdrop-blur-[200px]"></div>
    </div>
  );
};
