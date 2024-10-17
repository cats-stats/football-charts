import { exportData } from "@/lib/utils";
import { Button } from "@/lib/components/ui/button";
import { ButtonHTMLAttributes } from "react";

interface ExportDataButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  data: Record<string, unknown>[];
  header: readonly string[];
  filename: string;
}

/**
 * ExportDataButton is a component that allows the user to export data to a CSV file.
 *
 * Clicking the button will trigger the export of the data to a CSV file. Data and header columns can be customized.
 * Header columns will be written in the order they are provided.
 */
export function ExportDataButton({
  data,
  header,
  filename,
  ...props
}: ExportDataButtonProps) {
  return (
    <Button
      onClick={() => {
        type Columns = (typeof header)[number];
        exportData<Columns>(data, header, filename);
      }}
      {...props}
    >
      Export Data
    </Button>
  );
}
