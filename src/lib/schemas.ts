import { z } from "zod";

export const playerSchema = z.object({
  name: z.string(),
  number: z.number(),
});

export const positionSchema = z.object({
  x: z.number(),
  y: z.number(),
});
