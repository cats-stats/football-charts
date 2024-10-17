"use client";
import type { PointVariant } from "@/lib/components/ClickableFieldMap/Point";
import type { Position } from "@/lib/types";
import { useContext, createContext } from "react";

type Metadata = Record<PropertyKey, unknown>;
type MetadataWithPosition = Metadata & Position;
type PlayTypeToShape = Record<string, PointVariant>;

export const useClickMapContext = () => useContext(ClickMapCollectionContext);

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

interface DataCollectionContextProvider {
  points: MetadataWithPosition[];
  metadata: Metadata;
  updateMetadata: (key: PropertyKey, value: unknown) => void;
  plottingEnabled: boolean;
  enablePlotting: (state: boolean) => void;
  setPlayTypeToShape: (shape: PlayTypeToShape) => void;
}
