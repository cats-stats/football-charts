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

/**
 * ClickableFieldMap is a component that renders a clickable field map.
 *
 * This component exposes a callback that is called when a point is clicked.
 * The callback is passed the position of the point that was clicked. This
 * can be used to display additional information or to update the state of the application.
 *
 * The points provided to the component are rendered on the field map in the order provided.
 * The component uses a mapping to determine the variant of the point to render based on the value of the shapeKey.
 *
 * The component also allows for the field map to be inverted in order to account for teams flipping every quarter.
 */
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
            x={372 * (invert ? 1 - point.x : point.x)}
            y={172 * point.y} // don't invert y, observer is from same size, but teams flip every quarter
            r={3}
          />
        );
      })}
    </FieldMap>
  );
}
