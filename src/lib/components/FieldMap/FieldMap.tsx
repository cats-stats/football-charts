"use client";
import { getAssetUrl } from "@/lib/utils";
import { forwardRef, ReactElement, LegacyRef } from "react";

/**
 * FieldMap is a component that renders a field map.
 *
 * It is a wrapper around an SVG element that renders an image of a football field.
 * Children are rendered on top of the field.
 */
export const FieldMap = forwardRef(function FieldMap(
  { children }: { children?: ReactElement[] },
  ref?: LegacyRef<SVGSVGElement>
) {
  return (
    <div className="relative select-none w-full aspect-[372/172] border">
      <svg
        ref={ref}
        className="w-full aspect-[372/172] z-10"
        viewBox="0 0 372 172"
      >
        <image
          x="0"
          y="0"
          width="100%"
          height="100%"
          href={getAssetUrl("/scale-field.svg")}
        />
        {children}
      </svg>
    </div>
  );
});
