"use client";
import { getAssetUrl } from "@/lib/utils";
import { forwardRef, ReactElement, LegacyRef } from "react";

export const FieldMap = forwardRef(function FieldMap(
  { children }: { children?: ReactElement[] },
  ref?: LegacyRef<SVGSVGElement>
) {
  return (
    <div className="relative select-none w-full aspect-[1280/618]">
      <svg
        ref={ref}
        className="w-full aspect-[1280/618] z-10"
        viewBox="0 0 1280 618"
      >
        <image
          x="0"
          y="0"
          width="100%"
          height="100%"
          href={getAssetUrl("/football.png")}
        />
        {children}
      </svg>
    </div>
  );
});
