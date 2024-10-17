import { exportData } from "@/lib/utils";
import { Button } from "@/lib/components/ui/button";
import { ButtonHTMLAttributes } from "react";

interface ExportDataButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  data: Record<string, unknown>[];
  header: readonly string[];
  filename: string;
}

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
