import { Player } from "@/lib/types";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/lib/components/ui/form";
import { PlayerSelect } from "@/lib/components/Form/PlayerSelect";
import { PassingMetadataSubmission } from "../schema";
import { RedoIcon, TargetIcon, UserIcon } from "lucide-react";
import { Button } from "@/lib/components/ui/button";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from "@/lib/components/ui/select";

export default function MetadataForm({ players }: { players: Player[] }) {
  const { control, setValue } = useFormContext<PassingMetadataSubmission>();
  return (
    <div className="flex flex-col gap-3">
      <FormField
        control={control}
        name="quarterback"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              <div className="flex items-center gap-1">
                <UserIcon className="size-4" />
                Quarterback
              </div>
            </FormLabel>
            <PlayerSelect players={players} {...field} />
          </FormItem>
        )}
      />
      <div className="flex items-center gap-1">
        <FormField
          control={control}
          name="target"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>
                <div className="flex items-center gap-1">
                  <TargetIcon className="size-4" />
                  Target
                </div>
              </FormLabel>
              <div className="flex items-center gap-1 w-full">
                <PlayerSelect players={players} {...field} />
                <Button
                  variant="destructive"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setValue("target", null);
                  }}
                  size="sm"
                >
                  Clear
                </Button>
              </div>
            </FormItem>
          )}
        />
      </div>
      <div className="flex items-center gap-1">
        <FormField
          control={control}
          name="passResult"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>
                <div className="flex items-center gap-1">
                  <RedoIcon className="size-4" />
                  Pass Result
                </div>
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a pass result" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="complete">Complete</SelectItem>
                  <SelectItem value="incomplete">Incomplete</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
