import { z } from "zod";
import { playerSchema } from "./schemas";

export type Player = z.infer<typeof playerSchema>;

export interface Position {
  x: number;
  y: number;
}
