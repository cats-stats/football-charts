import type { Player } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/components/ui/select";
import { ControllerRenderProps, useFormContext } from "react-hook-form";
import { FormControl } from "../../ui/form";
import { useMemo, forwardRef, useState, useEffect } from "react";

interface PlayerSelectProps {
  players: Player[];
}

const PlayerSelect = forwardRef<
  HTMLButtonElement,
  PlayerSelectProps & ControllerRenderProps
>(({ players, ...field }, ref) => {
  const [value, setValue] = useState(field.value);
  const [key, setKey] = useState(0);

  const playerIdMap = useMemo(
    () =>
      players.reduce((acc, player) => {
        acc[`${player.number}-${player.name}`] = player;
        return acc;
      }, {} as Record<string, Player>),
    [players]
  );

  const ctx = useFormContext();
  const currentValue = ctx.watch(field.name);

  useEffect(() => {
    if (currentValue) {
      setValue(`${currentValue.number}-${currentValue.name}`);
    } else {
      setValue(undefined);
    }
    setKey((prev) => prev + 1);
  }, [currentValue]);

  return (
    <Select
      key={key}
      onValueChange={(value) => {
        if (playerIdMap[value]) {
          field.onChange(playerIdMap[value]);
        }
      }}
      value={value}
    >
      <FormControl>
        <SelectTrigger ref={ref}>
          <SelectValue placeholder="Select player" />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {players.map((player) => (
          <SelectItem
            key={player.number}
            value={`${player.number}-${player.name}`}
          >
            {player.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
});

PlayerSelect.displayName = "PlayerSelect";

export default PlayerSelect;
