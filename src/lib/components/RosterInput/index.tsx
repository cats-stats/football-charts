import { Label } from "@/lib/components/ui/label";
import { Input } from "@/lib/components/ui/input";
import { readRosterFile } from "@/lib/utils";
import type { Player } from "@/lib/types";
import { CircleHelpIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/lib/components/ui/tooltip";

interface RosterInputProps {
  onPlayersChange: (players: Player[]) => void;
}

/**
 * RosterInput is a component that allows the user to upload a CSV file containing a list of players.
 *
 * It is used to collect a list of players for a team.
 */
export function RosterInput({ onPlayersChange }: RosterInputProps) {
  return (
    <div className="flex flex-col gap-1">
      <Label className="text-sm flex items-center gap-1" htmlFor="file">
        Roster File
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <CircleHelpIcon className="size-3.5 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="w-48 text-xs">
                Upload a CSV file with player names and numbers. Format each row
                as: Name,Number.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Label>
      <Input
        type="file"
        accept=".csv"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            readRosterFile(file, onPlayersChange);
          }
        }}
      />
    </div>
  );
}
