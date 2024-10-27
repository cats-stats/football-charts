"use client";

import { Input } from "@/lib/components/ui/input";
import LOSRelativeQBViz, { type LOSRelativePoint } from "./viz";
import { Label } from "@/lib/components/ui/label";
import { useCallback, useRef, useState } from "react";
import { CircleHelpIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/lib/components/ui/tooltip";
import html2canvas from "html2canvas";
import { Button } from "@/lib/components/ui/button";
export default function LOSRelativeVisualization() {
  const [passData, setPassData] = useState<LOSRelativePoint[]>([]);
  const chartRef = useRef<HTMLDivElement>(null);

  const exportChart = useCallback(() => {
    if (chartRef.current) {
      html2canvas(chartRef.current, { backgroundColor: null }).then(
        (canvas) => {
          const pngUrl = canvas.toDataURL("image/png");
          const downloadLink = document.createElement("a");
          downloadLink.href = pngUrl;
          downloadLink.download = "chart.png";
          downloadLink.click();
        }
      );
    }
  }, [chartRef]);

  return (
    <div className="container w-full mx-auto px-8 py-2 space-y-6">
      <div className="flex items-end justify-between flex-wrap">
        <div>
          <h1 className="text-2xl font-bold w-full sm:w-auto">QB Pass Chart</h1>
          <p className="text-sm text-muted-foreground">
            Visualize quarterback passing tendencies relative to the line of
            scrimmage
          </p>
        </div>
        <div className="flex flex-col gap-1.5 mt-2">
          <Label className="text-sm flex items-center gap-1" htmlFor="csvInput">
            Upload Pass Data
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <CircleHelpIcon className="size-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="w-48 text-xs">
                    Upload a CSV file exported from the passing data collection
                    tool.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          <Input
            id="csvInput"
            type="file"
            accept=".csv"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                  const text = event.target?.result as string;
                  const rows = text.split("\n");
                  const headers = rows[0].split(",");

                  // Validate headers
                  const requiredHeaders = [
                    "quarterback",
                    "target",
                    "passResult",
                    "lineOfScrimmageX",
                    "lineOfScrimmageY",
                    "qbLocationX",
                    "qbLocationY",
                    "targetLocationX",
                    "targetLocationY",
                  ];

                  const hasAllHeaders = requiredHeaders.every((header) =>
                    headers.includes(header)
                  );

                  if (!hasAllHeaders) {
                    alert("CSV must contain all required columns");
                    return;
                  }

                  // Process the data
                  const data = rows
                    .slice(1)
                    .map((row) => {
                      const values = row.split(",");
                      const getIndex = (header: string) =>
                        headers.indexOf(header);

                      // Convert to LOS-relative coordinates
                      const losX =
                        Math.round(
                          (parseFloat(values[getIndex("lineOfScrimmageX")]) /
                            3) *
                            10
                        ) / 10;
                      const relativeTargetX =
                        Math.round(
                          (parseFloat(values[getIndex("targetLocationX")]) / 3 -
                            losX) *
                            10
                        ) / 10;

                      const relativeTargetY =
                        Math.round(
                          ((parseFloat(values[getIndex("targetLocationY")]) -
                            172 / 2) /
                            3) *
                            10
                        ) / 10;

                      return {
                        x: relativeTargetY,
                        y: relativeTargetX,
                        completed:
                          values[getIndex("passResult")] === "complete",
                      };
                    })
                    .filter((point) => !isNaN(point.x) && !isNaN(point.y));

                  setPassData(data);
                };
                reader.readAsText(file);
              }
            }}
          />
        </div>
      </div>

      <div className="border rounded-lg shadow-sm pt-4 px-4 flex justify-center w-full">
        <div className="relative w-full max-w-3xl pb-2" ref={chartRef}>
          <LOSRelativeQBViz passData={passData} />
        </div>
      </div>

      <div className="text-center text-sm text-muted-foreground flex justify-between items-center">
        {passData.length > 0 ? (
          <p>{passData.length} passes plotted</p>
        ) : (
          <p>Upload a CSV file to begin</p>
        )}
        <div className="flex justify-center">
          <Button
            className={passData.length === 0 ? "hidden" : ""}
            onClick={exportChart}
          >
            Export Chart
          </Button>
        </div>
      </div>
    </div>
  );
}
