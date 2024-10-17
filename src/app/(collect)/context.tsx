"use client";
import { useContext } from "react";
import { ClickMapCollectionContext } from "./layout";

export const useClickMapContext = () => useContext(ClickMapCollectionContext);
