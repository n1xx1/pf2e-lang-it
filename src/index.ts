import { fromPackPf2 } from "./converter-from-pack";

const convertEnabled = true;

Hooks.once("init", () => {
  if (typeof Babele === "undefined") {
    return;
  }

  Babele.get().register({
    module: "pf2e-lang-it",
    lang: "it",
    dir: "lang/compendiums",
  });

  Babele.get().registerConverters({
    "pf2e-lang-it-fromPack": fromPackPf2,
    "pf2e-lang-it-range": rangePf2,
    "pf2e-lang-it-time": timePf2,
    "pf2e-lang-it-list": listPf2,
  });
});

function listPf2(
  value: { value: string }[] | undefined,
  translation?: Record<string, string>
) {
  if (!value || !Array.isArray(value) || !translation) return value;
  return value.map((v, i) => {
    if (!v || !v.value) {
      return v;
    }
    const t = translation[`${i}`];
    if (!t) {
      return v;
    }
    return { value: t };
  });
}

const allowedTimes = ["1", "2", "3", "free", "reaction"];

function timePf2(time: string | null, translation?: string) {
  if (!time || !convertEnabled) return time;
  if (translation) {
    return translation;
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

function rangePf2(range: string | null | undefined, translation?: string) {
  if (!range || !convertEnabled) {
    return range;
  }
  if (translation) {
    return translation;
  }
  range = range.toLowerCase();

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
}

function convertFeetString(v: string) {
  return convertFeet(parseInt(v.replace(/,/g, ""))).toLocaleString("it-IT");
}

function convertMilesString(v: string) {
  return convertMiles(parseInt(v.replace(/,/g, ""))).toLocaleString("it-IT");
}

function convertFeet(v: number) {
  if (v % 5 == 0) {
    return (v / 5) * 1.5;
  }
  return round(v * 0.3);
}

function convertMiles(v: number) {
  return round(v * 1.6);
}

function round(num: number) {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}
