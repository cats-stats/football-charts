"use client";
import { createContext, ReactElement, useState } from "react";
import { ClickableFieldMap } from "@/lib/components/ClickableFieldMap/ClickableFieldMap";
import type { PointVariant } from "@/lib/components/ClickableFieldMap/Point";
import type { Position } from "@/lib/types";
import { Button } from "@/lib/components/ui/button";
import clsx from "clsx";

type Metadata = Record<PropertyKey, unknown>;
type MetadataWithPosition = Metadata & Position;
type PlayTypeToShape = Record<string, PointVariant>;

interface DataCollectionContextProvider {
  points: MetadataWithPosition[];
  metadata: Metadata;
  updateMetadata: (key: PropertyKey, value: unknown) => void;
  plottingEnabled: boolean;
  enablePlotting: (state: boolean) => void;
  setPlayTypeToShape: (shape: PlayTypeToShape) => void;
}

export const ClickMapCollectionContext =
  createContext<DataCollectionContextProvider>({
    points: [],
    metadata: { shape: "circle" },
    updateMetadata() {
      throw new Error("Not implemented.");
    },
    plottingEnabled: false,
    enablePlotting() {
      throw new Error("Not implemented.");
    },
    setPlayTypeToShape() {
      throw new Error("Not implemented.");
    },
  });

export default function CollectLayout({
  children,
}: {
  children: ReactElement[];
}) {
  const [points, setPoints] = useState<MetadataWithPosition[]>([]);
  const [metadata, setMetadata] = useState<Metadata>({});
  const [plottingEnabled, setPlottingEnabled] = useState<boolean>(false);
  const [playTypeToShape, setPlayTypeToShape] = useState<PlayTypeToShape>({});
  const [invert, setInvert] = useState<boolean>(false);

  const handleClick = (pos: Position) => {
    if (plottingEnabled) {
      setPoints((curr) => [
        ...curr,
        {
          x: invert ? 1 - pos.x : pos.x,
          y: pos.y,
          ...metadata,
        },
      ]);
    }
  };

  const updateMetadata = (key: PropertyKey, value: unknown) => {
    setMetadata({
      ...metadata,
      [key]: value,
    });
  };

  const enablePlotting = (state: boolean) => {
    setPlottingEnabled(state);
  };

  return (
    <main className="grid grid-cols-12 gap-3 px-8">
      <div className="col-span-12 flex flex-col md:flex-row gap-3">
        <div className="w-full md:w-10/12 p-3 border rounded-lg shadow-sm">
          <ClickableFieldMap
            points={points}
            handleClick={handleClick}
            shapeMapping={playTypeToShape}
            shapeKey="playType"
            invert={invert}
          />
          <div
            className={clsx(
              "flex justify-between px-3 py-1",
              invert ? "flex-row-reverse" : ""
            )}
          >
            <div className="text-sm text-muted-foreground">Davidson</div>
            <div className="text-sm text-muted-foreground">Opponent</div>
          </div>
          <div className="flex justify-end mt-1">
            <Button onClick={() => setInvert((curr) => !curr)}>
              Flip Field
            </Button>
          </div>
        </div>
        <ClickMapCollectionContext.Provider
          value={{
            points,
            plottingEnabled,
            metadata,
            updateMetadata,
            enablePlotting,
            setPlayTypeToShape,
          }}
        >
          {children}
        </ClickMapCollectionContext.Provider>
      </div>
    </main>
  );
}
