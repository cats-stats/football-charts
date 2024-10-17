"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/components/ui/select";
import { useClickMapContext } from "../context";
import { useEffect, useState } from "react";
import { Label } from "@/lib/components/ui/label";
import { CheckIcon, XIcon } from "lucide-react";
import { Input } from "@/lib/components/ui/input";
import { Button } from "@/lib/components/ui/button";

interface Player {
  name: string;
  number: number;
}

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
      <div>
        <Label className="text-sm" htmlFor="file">
          Roster File
        </Label>
        <Input
          type="file"
          accept=".csv"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (e) => {
                const text = e.target?.result as string;
                const players = text
                  .split("\n")
                  .map((line) => {
                    const [name, number] = line.split(",");
                    return { name, number: parseInt(number) };
                  })
                  .filter((player) => player.name && player.number)
                  .sort((a, b) => a.number - b.number);

                if (players.length > 0) {
                  setPlayers(players);
                } else {
                  console.error(
                    "No players found in roster file, or file is formatted incorrectly"
                  );
                }
              };
              reader.readAsText(file);
            }
          }}
        />
        <p className="text-xs leading-snug mt-3 text-muted-foreground">
          File should be a CSV with a list of players, each with a name and
          number. The first line can be a header, but is not required. Each csv
          row should be formatted as <b>Name,Number</b> without spaces.
        </p>
      </div>
      <div>
        <Label className="text-sm" htmlFor="receiver">
          Receiver
        </Label>
        <Select
          disabled={players.length === 0}
          onValueChange={(v) => updateMetadata("receiver", v)}
        >
          <SelectTrigger className="mt-1" id="receiver">
            <SelectValue placeholder="Select a Receiver"></SelectValue>
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
            <SelectValue placeholder="Play Type"></SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Complete Pass">
              <div className="flex items-center">
                <CheckIcon className="size-4 mr-2" />
                <span>Complete Pass</span>
              </div>
            </SelectItem>
            <SelectItem value="Incomplete Pass">
              <div className="flex items-center">
                <XIcon className="size-4 mr-2" />
                <span>Incomplete Pass</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button
        className="mt-6"
        onClick={() => {
          const data = points.map((point) => ({
            x: point.x,
            y: point.y,
            playType: point.playType,
            receiver: point.receiver,
          }));
          const header = ["x", "y", "playType", "receiver"] as const;
          const csvContent = [
            header.join(","),
            ...data.map((row) => header.map((key) => row[key]).join(",")),
          ].join("\n");

          const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
          });
          const link = document.createElement("a");
          if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "football-chart-data.csv");
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        }}
      >
        Export Data
      </Button>
    </div>
  );
}
