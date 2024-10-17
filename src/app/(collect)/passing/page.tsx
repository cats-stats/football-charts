"use client";

import { useEffect, useState } from "react";
import { useClickMapContext } from "../context";
import { CheckIcon, XIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/components/ui/select";
import { Label } from "@/lib/components/ui/label";
import { RosterInput } from "@/lib/components/RosterInput";
import { ExportDataButton } from "@/lib/components/ExportDataButton";
import type { Player } from "@/lib/types";

const playTypes = [
  {
    value: "Complete Pass",
    icon: CheckIcon,
  },
  {
    value: "Incomplete Pass",
    icon: XIcon,
  },
];

export default function PassingCharting() {
  const [players, setPlayers] = useState<Player[]>([]);

  const {
    metadata,
    points,
    updateMetadata,
    enablePlotting,
    setPlayTypeToShape,
  } = useClickMapContext();

  const { playType, receiver } = metadata;

  useEffect(() => {
    setPlayTypeToShape({
      "Complete Pass": "circle",
      "Incomplete Pass": "x",
    });
  }, [setPlayTypeToShape]);

  useEffect(() => {
    if (playType && receiver) {
      enablePlotting(true);
    }
  }, [playType, receiver, enablePlotting]);

  return (
    <div className="w-full md:w-3/12 flex flex-col gap-3">
      <RosterInput onPlayersChange={setPlayers} />
      <div>
        <Label className="text-sm" htmlFor="receiver">
          Receiver
        </Label>
        <Select
          disabled={players.length === 0}
          onValueChange={(v) => updateMetadata("receiver", v)}
        >
          <SelectTrigger className="mt-1" id="receiver">
            <SelectValue placeholder="Select a Receiver" />
          </SelectTrigger>
          <SelectContent>
            {players.map((player) => (
              <SelectItem
                key={`${player.name}-${player.number}`}
                value={player.name}
              >
                {player.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-sm" htmlFor="playType">
          Play Type
        </Label>
        <Select
          disabled={players.length === 0}
          onValueChange={(v) => updateMetadata("playType", v)}
        >
          <SelectTrigger className="mt-1" id="playType">
            <SelectValue placeholder="Play Type" />
          </SelectTrigger>
          <SelectContent>
            {playTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                <div className="flex items-center">
                  <type.icon className="size-4 mr-2" />
                  <span>{type.value}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <ExportDataButton
        className="mt-6"
        data={points}
        header={["playType", "receiver", "x", "y"] as const}
        filename="passing-data.csv"
      >
        Export Data
      </ExportDataButton>
    </div>
  );
}
