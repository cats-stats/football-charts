"use client";
import { useClickPosition } from "@/lib/hooks/useClickPosition";
import { Position } from "@/lib/types";
import { FieldMap } from "../FieldMap";
import { Point, PointVariant } from "./Point";

interface ClickableFieldMapProps<Metadata> {
  points: (Position & Metadata)[];
  shapeMapping: Record<string, PointVariant>;
  shapeKey: keyof Metadata;
  handleClick: (pos: Position) => void;
  invert?: boolean;
}

export function ClickableFieldMap<Metadata>({
  points,
  handleClick,
  shapeMapping,
  shapeKey,
  invert = false,
}: ClickableFieldMapProps<Metadata>) {
  const { ref } = useClickPosition(handleClick);

  return (
    <FieldMap ref={ref}>
      {points.map((point, index) => {
        return (
          <Point
            key={index}
            variant={shapeMapping[point[shapeKey]]}
            x={1280 * (invert ? 1 - point.x : point.x)}
            y={618 * point.y} // don't invert y, observer is from same size, but teams flip every quarter
            r={12}
          />
        );
      })}
    </FieldMap>
  );
}
