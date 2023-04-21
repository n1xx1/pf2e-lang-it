import { shouldConvertUnits } from ".";
import { convertFeetString, convertMilesString } from "./utils";

export function rangePf2(
  range: string | null | undefined,
  translation?: string
) {
  if (translation) {
    return translation;
  }
  if (!range || !shouldConvertUnits()) {
    return range;
  }
  range = range.toLowerCase();
  if (range === "touch") {
    return "contatto";
  }
  if (range === "planetary") {
    return "planetario";
  }
  const match = range.match(/^([\d.,]+)\s*(|feet|foot|miles?)$/);
  if (match) {
    const [rangeStr, type] = match;
    if (!type || type === "feet" || type === "foot") {
      return `${convertFeetString(rangeStr)} metri`;
    }
    if (type.startsWith(" mile")) {
      return `${convertMilesString(rangeStr)} miglia`;
    }
  }
  return range;
}
