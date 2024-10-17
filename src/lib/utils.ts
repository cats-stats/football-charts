import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Player } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns the asset URL for the given path.
 *
 * This is required as the site is hosted on GitHub Pages, and the asset
 * is not served from the root of the domain.
 *
 * @param path The path to the asset.
 * @returns The asset URL.
 */
export function getAssetUrl(path: string) {
  return process.env.NODE_ENV === "development"
    ? path
    : "/football-charts" + path;
}

/**
 * Reads a roster file and calls a callback with the list of players.
 * @param file The roster file to read.
 * @param callback The callback to call with the list of players.
 */
export function readRosterFile(
  file: File,
  callback: (players: Player[]) => void
) {
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
      callback(players);
    } else {
      console.error(
        "No players found in roster file, or file is formatted incorrectly"
      );
    }
  };
  reader.readAsText(file);
}

export function exportData<Keys extends string>(
  data: Record<Keys, unknown>[],
  keys: readonly Keys[],
  filename: string = "data-output.csv"
) {
  const header = keys;
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
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
