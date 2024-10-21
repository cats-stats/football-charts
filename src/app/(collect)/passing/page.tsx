"use client";

import { createContext, useState } from "react";
import { RosterInput } from "@/lib/components/RosterInput";
import type { Player, Position } from "@/lib/types";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/lib/components/ui/table";
import { fieldDimensions } from "@/lib/constants";
import { ExportDataButton } from "@/lib/components/ExportDataButton";

const prettyKeys = {
  quarterback: "Quarterback",
  target: "Target",
  passResult: "Pass Result",
  lineOfScrimmage: "Line of Scrimmage",
  qbLocation: "Quarterback Location",
  targetLocation: "Target Location",
};

function generatePlayDescription(datapoint: PassingMetadataSubmission) {
  switch (datapoint.passResult) {
    case "incomplete":
      if (datapoint.target) {
        return `${datapoint.quarterback.name} pass incomplete. Intended target: ${datapoint.target.name}`;
      }
      return `${datapoint.quarterback.name} pass incomplete.`;
    case "complete":
      return `${datapoint.quarterback.name} pass complete to ${datapoint.target.name}`;
  }
}

function invertPosition(position: Position, flipY: boolean = true) {
  return {
    x: fieldDimensions.width - position.x,
    y: flipY ? fieldDimensions.height - position.y : position.y,
  };
}

interface FieldInversionContextProps {
  isFieldInverted: boolean;
  setIsFieldInverted: (v: boolean) => void;
}

export const FieldInversionContext = createContext<FieldInversionContextProps>({
  isFieldInverted: false,
  setIsFieldInverted: () => {
    throw new Error("not implemented");
  },
});

export default function PassingChart() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [data, setData] = useState<PassingMetadataSubmission[]>([]);
  const [isFieldInverted, setIsFieldInverted] = useState(false);

  const form = useForm<PassingMetadataSubmission>({
    resolver: zodResolver(passingMetadataSubmissionSchema),
    defaultValues: {
      passResult: "complete",
    },
  });

  const { toast } = useToast();

  const { handleSubmit } = form;

  const onSubmit = (data: PassingMetadataSubmission) => {
    if (isFieldInverted) {
      const invertedData = { ...data };
      invertedData.lineOfScrimmage = invertPosition(
        data.lineOfScrimmage,
        false
      );
      invertedData.qbLocation = invertPosition(data.qbLocation);
      invertedData.targetLocation = invertPosition(data.targetLocation);
      setData((prev) => [...prev, invertedData]);
    } else {
      setData((prev) => [...prev, data]);
    }
    toast({
      title: "Play submitted successfully!",
    });
    form.reset({
      passResult: "complete",
      quarterback: data.quarterback,
      lineOfScrimmage:
        data.passResult === "complete"
          ? {
              x: Math.round(data.targetLocation.x * 2) / 2,
              y: 0,
            }
          : { ...data.lineOfScrimmage },
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
      <div className="flex items-end justify-between w-full flex-wrap gap-4">
        <div className="w-full md:w-fit">
          <h1 className="text-2xl font-bold">Passing Chart</h1>
          <p className=" text-muted-foreground text-sm">
            Mapping utility for QB tendency data collection
          </p>
        </div>
        <div className="flex items-end gap-2">
          <RosterInput onPlayersChange={setPlayers} />
          <ExportDataButton
            data={data.map((play) => ({
              quarterback: play.quarterback.name,
              target: play.target?.name ?? "",
              passResult: play.passResult,
              lineOfScrimmageX: play.lineOfScrimmage.x,
              lineOfScrimmageY: play.lineOfScrimmage.y,
              qbLocationX: play.qbLocation.x,
              qbLocationY: play.qbLocation.y,
              targetLocationX: play.targetLocation.x,
              targetLocationY: play.targetLocation.y,
            }))}
            header={[
              "quarterback",
              "target",
              "passResult",
              "lineOfScrimmageX",
              "lineOfScrimmageY",
              "qbLocationX",
              "qbLocationY",
              "targetLocationX",
              "targetLocationY",
            ]}
            filename="passing-data.csv"
          />
        </div>
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
          <div className="w-full md:w-3/4 flex flex-col gap-y-4">
            <div className="p-4 border rounded-lg flex flex-col gap-4 items-center">
              <FieldInversionContext.Provider
                value={{
                  isFieldInverted,
                  setIsFieldInverted: (v) => setIsFieldInverted(v),
                }}
              >
                <FieldMapContainer />
              </FieldInversionContext.Provider>
            </div>
            <div className="border shadow-sm rounded p-4 py-6">
              <h2 className="font-medium text-lg px-2">Recent Plays</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Play Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.toReversed().map((play, index) => (
                    <TableRow className="hover:bg-muted" key={index}>
                      <TableCell>{generatePlayDescription(play)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
