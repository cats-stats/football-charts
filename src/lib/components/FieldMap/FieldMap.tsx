"use client";
import { getAssetUrl } from "@/lib/utils";
import React, { forwardRef, LegacyRef } from "react";
import { fieldDimensions } from "@/lib/constants";
/**
 * FieldMap is a component that renders a field map.
 *
 * It is a wrapper around an SVG element that renders an image of a football field.
 * Children are rendered on top of the field.
 */
export const FieldMap = forwardRef(function FieldMap(
  { children }: { children?: React.ReactNode },
  ref?: LegacyRef<SVGSVGElement>
) {
  return (
    <div
      style={{
        aspectRatio: `${fieldDimensions.width}/${fieldDimensions.height}`,
      }}
      className="relative select-none w-full border"
    >
      <svg
        ref={ref}
        className="w-full z-10"
        viewBox={`0 0 ${fieldDimensions.width} ${fieldDimensions.height}`}
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
