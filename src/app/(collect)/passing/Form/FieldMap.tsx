import { ClickableFieldMap } from "@/lib/components/ClickableFieldMap/ClickableFieldMap";
import { Tabs, TabsList, TabsTrigger } from "@/lib/components/ui/tabs";
import {
  UserRoundIcon,
  CheckIcon,
  XIcon,
  FlagIcon,
  TargetIcon,
} from "lucide-react";
import { Position } from "@/lib/types";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { PassingMetadataSubmission } from "../schema";
import { fieldDimensions } from "@/lib/constants";

export default function FieldMapContainer() {
  const [activeSelector, setActiveSelector] =
    useState<string>("scrimmage-location");
  return (
    <>
      <PassingFieldMap activeSelector={activeSelector} />
      <ActiveTabSelector
        activeSelector={activeSelector}
        setActiveSelector={setActiveSelector}
      />
    </>
  );
}

function PassingFieldMap({ activeSelector }: { activeSelector: string }) {
  const ctx = useFormContext<PassingMetadataSubmission>();

  const qbLocation = ctx.watch("qbLocation");
  const targetLocation = ctx.watch("targetLocation");
  const lineOfScrimmage = ctx.watch("lineOfScrimmage");
  const passResult = ctx.watch("passResult");

  function handleFieldClick(position: Position) {
    let x = position.x * fieldDimensions.width;
    let y = position.y * fieldDimensions.height;

    if (activeSelector === "lineOfScrimmage") {
      y = 0;
      x = Math.round(2 * x) / 2;
    }

    ctx.setValue(
      activeSelector as "qbLocation" | "targetLocation" | "lineOfScrimmage",
      { x, y }
    );
  }

  return (
    <ClickableFieldMap handleClick={handleFieldClick}>
      {lineOfScrimmage && (
        <line
          x1={lineOfScrimmage.x}
          y1={6}
          x2={lineOfScrimmage.x}
          y2={166}
          className="stroke-blue-800 stroke-1"
        />
      )}
      {qbLocation && targetLocation && (
        <line
          x1={qbLocation.x}
          y1={qbLocation.y}
          x2={targetLocation.x}
          y2={targetLocation.y}
          strokeDasharray="5,5"
          className="stroke-accent-foreground stroke-1"
        />
      )}
      {qbLocation && (
        <>
          <circle
            cx={qbLocation.x}
            cy={qbLocation.y}
            r={5}
            className="fill-blue-500"
          />
          <UserRoundIcon
            size={8}
            className="text-white"
            x={qbLocation.x - 4}
            y={qbLocation.y - 4}
          />
        </>
      )}
      {targetLocation && (
        <>
          <circle
            cx={targetLocation.x}
            cy={targetLocation.y}
            r={5}
            className="fill-white stroke-accent-foreground stroke-[0.75]"
          />
          {passResult === "complete" ? (
            <CheckIcon
              size={9}
              strokeWidth={2.5}
              className="text-green-600"
              x={targetLocation.x - 4.5}
              y={targetLocation.y - 4}
            />
          ) : (
            <XIcon
              size={8}
              strokeWidth={2.5}
              className="text-primary"
              x={targetLocation.x - 4}
              y={targetLocation.y - 4}
            />
          )}
        </>
      )}
    </ClickableFieldMap>
  );
}

function ActiveTabSelector({
  activeSelector,
  setActiveSelector,
}: {
  activeSelector: string;
  setActiveSelector: (value: string) => void;
}) {
  return (
    <Tabs
      value={activeSelector}
      onValueChange={setActiveSelector}
      className="flex flex-col items-center text-center gap-2"
      defaultValue="qb-position"
    >
      <TabsList>
        <TabsTrigger className="flex space-x-2" value="lineOfScrimmage">
          <FlagIcon className="size-4" />
          <span className="text-sm">Scrimmage</span>
        </TabsTrigger>
        <TabsTrigger className="flex space-x-2" value="qbLocation">
          <UserRoundIcon className="size-4" />
          <span className="text-sm">Quarterback</span>
        </TabsTrigger>
        <TabsTrigger className="flex space-x-2" value="targetLocation">
          <TargetIcon className="size-4" />
          <span className="text-sm">Target</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
