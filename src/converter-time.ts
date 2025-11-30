const allowedTimes = [
  "0",
  "free",
  "1",
  "2",
  "3",
  "1 or 2",
  "1 to 3",
  "2 or 3",
  "2 rounds",
  "reaction",
];

export function timePf2(time: string | number | null, translation?: string) {
  if (translation) {
    return translation;
  }
  if (!time || typeof time !== "string") {
    return time;
  }
  time = time.toLowerCase();
  if (allowedTimes.includes(time)) {
    return time;
  }
  const match = time.match(/^([\d.,]+)\s*(minutes?|days?|hours?)$/);
  if (match) {
    const [timeStr, type] = match;
    if (type.startsWith("minute")) {
      return `${timeStr} minut${type.endsWith("s") ? "i" : "o"}`;
    }
    if (type.startsWith("hour")) {
      return `${timeStr} or${type.endsWith("s") ? "e" : "a"}`;
    }
    if (type.startsWith("day")) {
      return `${timeStr} giorn${type.endsWith("s") ? "i" : "o"}`;
    }
  }
  return time;
}
