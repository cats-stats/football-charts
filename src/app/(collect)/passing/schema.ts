import { z } from "zod";
import { playerSchema, positionSchema } from "@/lib/schemas";

const incompletePassMetadata = z.object({
  quarterback: playerSchema,
  target: playerSchema.nullable(),
  passResult: z.literal("incomplete"),
  lineOfScrimmage: positionSchema,
  qbLocation: positionSchema,
  targetLocation: positionSchema,
});

const completePassMetadata = z.object({
  quarterback: playerSchema,
  target: playerSchema,
  passResult: z.literal("complete"),
  lineOfScrimmage: positionSchema,
  qbLocation: positionSchema,
  targetLocation: positionSchema,
});

export const passingMetadataSubmissionSchema = z.discriminatedUnion(
  "passResult",
  [incompletePassMetadata, completePassMetadata]
);

export type PassingMetadataSubmission = z.infer<
  typeof passingMetadataSubmissionSchema
>;

export function validatePassPlay(submission: unknown) {
  return passingMetadataSubmissionSchema.safeParse(submission);
}
