import { Label } from "@/lib/components/ui/label";
import { Input } from "@/lib/components/ui/input";
import { readRosterFile } from "@/lib/utils";
import type { Player } from "@/lib/types";

export function RosterInput({
  onPlayersChange,
}: {
  onPlayersChange: (players: Player[]) => void;
}) {
  return (
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
            readRosterFile(file, onPlayersChange);
          }
        }}
      />
      <p className="text-xs leading-snug mt-3 text-muted-foreground">
        File should be a CSV with a list of players, each with a name and
        number. The first line can be a header, but is not required. Each csv
        row should be formatted as <b>Name,Number</b> without spaces.
      </p>
    </div>
  );
}
