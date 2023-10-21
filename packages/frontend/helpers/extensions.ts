import { ExtensionDocData } from "~/types/extensions";

export function createExtensionSearchString(data: ExtensionDocData): string {
  return [
    data.title.toLowerCase(),
    data.summary.toLowerCase(),
    data.tags.toLowerCase().split(",").join(" "),
  ].join(" ");
}
