import { useRef, useEffect } from "react";
import { Position } from "@/lib/types";

/**
 * useClickPosition is a hook that provides a reference to an SVG element and a callback to handle click events.
 *
 * The callback is passed the position of the click event in the SVG element.
 * The position is normalized to a value between 0 and 1 for both x and y to account for different screen sizes.
 * The callback is called with the relative position of the click event.
 */
export const useClickPosition = (callback: (pos: Position) => void) => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && event.clientX) {
        const rect = ref.current.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width; // Normalize x
        const y = (event.clientY - rect.top) / rect.height; // Normalize y
        // check if click is within svg bounds
        if (x > 0 && x < 1 && y > 0 && y < 1) {
          callback({ x, y });
        }
      }
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [callback]);

  return { ref };
};
