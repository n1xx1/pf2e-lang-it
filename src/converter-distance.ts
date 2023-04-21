import { shouldConvertUnits } from ".";
import { convertFeet } from "./utils";

export function distancePf2(distance: number | string, translation?: string) {
  if (translation) {
    return translation;
  }
  if (!distance || !shouldConvertUnits()) {
    return distance;
  }
  const num = typeof distance === "string" ? parseInt(distance) : distance;
  return convertFeet(num);
}
