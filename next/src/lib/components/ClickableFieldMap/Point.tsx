"use client";

import { useMemo } from "react";

export type PointVariant = "circle" | "square" | "star" | "plus" | "x";

interface ShapeProps {
  r: number;
  x: number;
  y: number;
}

interface ShapePropsWithFill extends ShapeProps {
  fill: string;
}

type PointProps = {
  variant?: PointVariant;
} & ShapeProps;

export const Point = ({ variant = "circle", x, y, r }: PointProps) => {
  const shapeProps = { x, y, r };
  switch (variant) {
    case "square":
      return <Square fill="blue" {...shapeProps} />;
    case "star":
      return <Star fill="orange" {...shapeProps} />;
    case "x":
      return <XSymbol fill="red" {...shapeProps} />;
    case "circle":
      return <Circle fill="lime" {...shapeProps} />;
    case "plus":
      return <Plus fill="black" {...shapeProps} />;
    default:
      return null;
  }
};

const Circle = ({ r, x, y, fill }: ShapePropsWithFill) => {
  return (
    <circle
      cx={x}
      cy={y}
      r={r}
      stroke={"black"}
      strokeWidth={0.5}
      fill={fill}
    />
  );
};

const Square = ({ fill, r, x, y }: ShapePropsWithFill) => {
  return (
    <rect
      className="origin-center"
      x={x - r}
      y={y - r}
      width={r * 2}
      height={r * 2}
      fill={fill}
    />
  );
};

const Star = ({ fill, r, x, y }: ShapePropsWithFill) => {
  return (
    <path
      d="M 0.5 0 L 0.61 0.35 L 1 0.38 L 0.68 0.61 L 0.79 1 L 0.5 0.8 L 0.21 1 L 0.32 0.61 L 0 0.38 L 0.39 0.35 Z"
      fill={fill}
      style={{
        transform: `translate(${x}px,${y}px) scale(${2.5 * r})`,
      }}
    />
  );
};

const XSymbol = ({ fill, r, x, y }: ShapePropsWithFill) => {
  const strokeWidth = useMemo(() => Math.floor(r / 3), [r]);
  return (
    <g transform={`translate(${x}, ${y})`}>
      <line
        x1={-r}
        y1={-r}
        x2={r}
        y2={r}
        stroke={fill}
        strokeWidth={strokeWidth}
      />
      <line
        x1={-r}
        y1={r}
        x2={r}
        y2={-r}
        stroke={fill}
        strokeWidth={strokeWidth}
      />
    </g>
  );
};

const Plus = ({ fill, r, x, y }: ShapePropsWithFill) => {
  const strokeWidth = useMemo(() => Math.floor(r / 3), [r]);
  return (
    <g transform={`translate(${x}, ${y})`}>
      <line
        x1="0"
        y1={-r}
        x2="0"
        y2={r}
        stroke={fill}
        strokeWidth={strokeWidth}
      />
      <line
        x1={-r}
        y1="0"
        x2={r}
        y2="0"
        stroke={fill}
        strokeWidth={strokeWidth}
      />
    </g>
  );
};
