"use client";

import React, { useState } from "react";

export interface LOSRelativePoint {
  x: number;
  y: number;
  completed: boolean;
}

interface LOSRelativeVisualizationProps {
  passData: LOSRelativePoint[];
}

const FIELD_WIDTH = 53.3; // yards
const FIELD_LENGTH = 70; // yards (excluding end zones)

// Add after other constant definitions
const hashMarks = Array.from({ length: 76 }, (_, i) => i - 10).filter(
  (y) => y % 5 !== 0
); // -10 to 60

export default function LOSRelativeQBViz({
  passData,
}: LOSRelativeVisualizationProps) {
  const [hoveredPass, setHoveredPass] = useState<number | null>(null);

  const width = 550;
  const height = 300;
  const margin = { top: 0, right: 0, bottom: 0, left: 0 };
  const fieldHeight = height - margin.top - margin.bottom;
  const multiplier = 0.45;
  // Perspective transformation
  const xScale = (x: number, y: number) => {
    // Normalize y from -10 to 60 to get a perspective factor
    const normalizedY = (y + 10) / 70; // Will be 0 at y=-10, 1 at y=60

    // Create perspective that decreases as we go further back
    const perspective = 1 + multiplier / 7 - normalizedY * multiplier; // 1.2 at y=-10, 1.0 at y=0, 0.6 at y=60

    // Apply the perspective to the x coordinate
    return ((x / FIELD_WIDTH) * perspective + 0.5) * width;
  };

  const yScale = (y: number) => {
    // Map y from [-10, 60] to [height-margin.bottom, margin.top]
    return (1 - (y + 10) / 75) * fieldHeight + margin.top;
  };

  const createFieldShape = () => {
    const top = yScale(FIELD_LENGTH);
    const bottom = yScale(-10); // Changed from 0 to -10
    const leftTop = xScale(-FIELD_WIDTH / 2, FIELD_LENGTH);
    const rightTop = xScale(FIELD_WIDTH / 2, FIELD_LENGTH);
    const leftBottom = xScale(-FIELD_WIDTH / 2, -10); // Changed from 0 to -10
    const rightBottom = xScale(FIELD_WIDTH / 2, -10); // Changed from 0 to -10

    return `M${leftBottom},${bottom} L${rightBottom},${bottom} L${rightTop},${top} L${leftTop},${top} Z`;
  };

  const fieldLines = [-10, 0, 10, 20, 30, 40, 50, 60];
  const intermediateLines = [-5, 5, 15, 25, 35, 45, 55, 65]; // Added intermediate lines

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="bg-neutral-900">
        {/* Define the glow filter */}
        <defs>
          <radialGradient
            id="losGlow"
            cx="0.5"
            cy="0.5"
            r="0.5"
            fx="0.5"
            fy="0.5"
          >
            <stop offset="0%" stopColor="#aaa" stopOpacity="0.05" />
            <stop offset="50%" stopColor="#aaa" stopOpacity="0.02" />
            <stop offset="100%" stopColor="#aaa" stopOpacity="0" />
          </radialGradient>
          <filter id="blur">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>

        {/* Field background */}
        <path d={createFieldShape()} className="fill-neutral-800" />

        {/* LOS glow effect */}
        <rect
          x={width / 2 - 240}
          y={yScale(-10) - 120}
          width={480}
          height={240}
          fill="url(#losGlow)"
          filter="url(#blur)"
          opacity={1}
        />

        {/* Intermediate field lines */}
        {intermediateLines.map((y) => (
          <line
            key={`intermediate-line-${y}`}
            x1={xScale(-FIELD_WIDTH / 2, y)}
            y1={yScale(y)}
            x2={xScale(FIELD_WIDTH / 2, y)}
            y2={yScale(y)}
            stroke="#555"
            strokeWidth={1 - (y - 0.5) / FIELD_LENGTH + 0.3}
            opacity={1}
          />
        ))}

        {/* Main field lines */}
        {fieldLines.map((y) => (
          <line
            key={`line-${y}`}
            x1={xScale(-FIELD_WIDTH / 2, y)}
            y1={yScale(y)}
            x2={xScale(FIELD_WIDTH / 2, y)}
            y2={yScale(y)}
            stroke={y === 0 ? "#3b82f6" : "#777"}
            strokeWidth={1 - (y - 0.5) / FIELD_LENGTH + 0.3}
          />
        ))}

        {/* Sidelines */}
        {[-FIELD_WIDTH / 2, FIELD_WIDTH / 2].map((x) => (
          <path
            key={`sideline-${x}`}
            d={`M${xScale(x, -10)},${yScale(-10)} L${xScale(
              x,
              FIELD_LENGTH
            )},${yScale(FIELD_LENGTH)}`}
            stroke="#aaa"
            strokeWidth={12}
            opacity={1}
            fill="none"
          />
        ))}

        {/* Yard numbers */}
        {[-10, 0, 10, 20, 30, 40, 50, 60].map((y) => (
          <React.Fragment key={`yardnumber-${y}`}>
            <text
              x={xScale(-FIELD_WIDTH / 2 + 2, y)}
              y={yScale(y) - 2}
              fill="white"
              fontSize={8}
              textAnchor="start"
              className="font-inter"
            >
              {y === 0 ? "LOS" : y > 0 ? `+${y}` : `${y}`}
            </text>
            <text
              x={xScale(FIELD_WIDTH / 2 - 2, y)}
              y={yScale(y) - 2}
              fill="white"
              fontSize={8}
              textAnchor="end"
              className="font-inter"
            >
              {y === 0 ? "LOS" : y > 0 ? `+${y}` : `${y}`}
            </text>
          </React.Fragment>
        ))}

        {/* Hash marks */}
        {hashMarks.map((y) => (
          <React.Fragment key={`hash-${y}`}>
            {/* Left hash marks */}
            <line
              x1={xScale(-FIELD_WIDTH / 2 + 20, y)}
              y1={yScale(y)}
              x2={xScale(-FIELD_WIDTH / 2 + 21, y)}
              y2={yScale(y)}
              stroke="#777"
              strokeWidth={0.5}
            />
            {/* Right hash marks */}
            <line
              x1={xScale(FIELD_WIDTH / 2 - 20, y)}
              y1={yScale(y)}
              x2={xScale(FIELD_WIDTH / 2 - 21, y)}
              y2={yScale(y)}
              stroke="#777"
              strokeWidth={0.5}
            />
          </React.Fragment>
        ))}

        {/* Pass locations */}
        {passData.map((pass, index) => {
          const normalizedY = (pass.y + 10) / 70;
          const perspective = 1 + multiplier / 7 - normalizedY * multiplier;
          const baseRadius = 8;

          return (
            <ellipse
              key={`pass-${index}`}
              cx={xScale(pass.x, pass.y)}
              cy={yScale(pass.y)}
              rx={baseRadius * perspective} // Horizontal radius
              ry={baseRadius * perspective * 0.6} // Vertical radius compressed
              fill={pass.completed ? "green" : "red"}
              onMouseEnter={() => setHoveredPass(index)}
              onMouseLeave={() => setHoveredPass(null)}
            />
          );
        })}

        {/* Hover information */}
        {hoveredPass !== null && (
          <g
            transform={`translate(${xScale(
              passData[hoveredPass].x,
              passData[hoveredPass].y
            )}, ${yScale(passData[hoveredPass].y) - 20})`}
          >
            <rect
              x="-50"
              y="-20"
              width="100"
              height="20"
              fill="black"
              opacity="0.7"
              rx="5"
              ry="5"
            />
            <text
              x="0"
              y="-5"
              textAnchor="middle"
              fill="white"
              fontSize="12"
              className="font-inter"
            >
              {`${passData[hoveredPass].x}yd, ${passData[hoveredPass].y}yd`}
            </text>
          </g>
        )}
      </svg>
      <div className="mt-4 text-center">
        <span className="inline-flex items-center mr-4">
          <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
          Completed Pass
        </span>
        <span className="inline-flex items-center">
          <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
          Incomplete Pass
        </span>
      </div>
    </div>
  );
}
