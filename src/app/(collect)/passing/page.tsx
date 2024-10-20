"use client";

import { useState } from "react";
import { RosterInput } from "@/lib/components/RosterInput";
import type { Player } from "@/lib/types";
import {
  PassingMetadataSubmission,
  passingMetadataSubmissionSchema,
} from "./schema";
import { FieldErrors, useForm } from "react-hook-form";
import { Form } from "@/lib/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import FieldMapContainer from "./Form/FieldMap";
import MetadataForm from "./Form/Metadata";
import { Button } from "@/lib/components/ui/button";
import { useToast } from "@/lib/hooks/use-toast";

const prettyKeys = {
  quarterback: "Quarterback",
  target: "Target",
  passResult: "Pass Result",
  lineOfScrimmage: "Line of Scrimmage",
  qbLocation: "Quarterback Location",
  targetLocation: "Target Location",
};

export default function PassingChart() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [data, setData] = useState<PassingMetadataSubmission[]>([]);

  const form = useForm<PassingMetadataSubmission>({
    resolver: zodResolver(passingMetadataSubmissionSchema),
    defaultValues: {
      passResult: "complete",
    },
  });

  const { toast } = useToast();

  const { handleSubmit } = form;

  const onSubmit = (data: PassingMetadataSubmission) => {
    setData((prev) => [...prev, data]);
    toast({
      title: "Play submitted successfully!",
    });
    form.reset({
      passResult: "complete",
      quarterback: data.quarterback,
      target: undefined,
    });
  };

  const onInvalid = (errors: FieldErrors<PassingMetadataSubmission>) => {
    toast({
      title: "Play submission failed! Errors:",
      variant: "destructive",
      description: Object.entries(errors)
        .map(
          ([key, value]) =>
            `${
              prettyKeys[key as keyof typeof prettyKeys]
            }: ${value.message?.toLowerCase()}`
        )
        .join(", "),
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full justify-between">
        <h1 className="text-2xl font-bold">Passing Chart</h1>
        <RosterInput onPlayersChange={setPlayers} />
      </div>
      <Form {...form}>
        <form
          className="w-full flex flex-col-reverse md:flex-row gap-4"
          onSubmit={handleSubmit(onSubmit, onInvalid)}
        >
          <div className="w-full md:w-1/4 shrink-0 flex flex-col gap-4">
            <MetadataForm players={players} />
            <Button variant="default" className="w-fit" type="submit">
              Submit
            </Button>
          </div>
          <div className="w-full md:w-3/4">
            <div className="p-4 border rounded-lg flex flex-col gap-4 items-center">
              <FieldMapContainer />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
