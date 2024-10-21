"use client";
import { useClickPosition } from "@/lib/hooks/useClickPosition";
import { Position } from "@/lib/types";
import { FieldMap } from "../FieldMap";

interface ClickableFieldMapProps {
  handleClick: (pos: Position) => void;
  children?: React.ReactNode;
}

/**
 * ClickableFieldMap is a component that renders a clickable field map.
 *
 * This component exposes a callback that is called when a point is clicked.
 */
export function ClickableFieldMap({
  handleClick,
  children,
}: ClickableFieldMapProps) {
  const { ref } = useClickPosition(handleClick);

  return <FieldMap ref={ref}>{children}</FieldMap>;
}
