"use client";
import { RequiredMetadata } from "@/lib/components/ClickableFieldMap/ClickableFieldMap";
import { Position } from "@/lib/types";
import { createContext, ReactElement, useContext } from "react";
import { ClickMapCollectionContext } from "./layout";

export const useClickMapContext = () => useContext(ClickMapCollectionContext);
