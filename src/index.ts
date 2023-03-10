import type { Translations } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/client/apps/i18n";
import { compatAutoanimations } from "./compat/autoanimations";
import { fromPackPf2 } from "./converter-from-pack";
import { otherSpeedsPf2, speedPf2 } from "./converter-speeds";
import { libWrapper } from "./libwrapper";
import { generateSpellcastingEntryTitles } from "./spellcasting-entry";
import {
  convertFeet,
  convertFeetString,
  convertMilesString,
  removeMismatchingTypes,
} from "./utils";

const ID = "pf2e-lang-it";
const convertEnabled = true;

Hooks.once("init", () => {
  if (typeof Babele === "undefined") {
    return;
  }

  Babele.get().register({
    module: ID,
    lang: "it",
    dir: "lang/compendiums",
  });

  Babele.get().registerConverters({
    [`${ID}-fromPack`]: fromPackPf2,
    [`${ID}-range`]: rangePf2,
    [`${ID}-time`]: timePf2,
    [`${ID}-list`]: listPf2,
    [`${ID}-distance`]: distancePf2,
    [`${ID}-speed`]: speedPf2,
    [`${ID}-otherSpeeds`]: otherSpeedsPf2,
    [`${ID}-heightening`]: heighteningPf2,
  });
});

Hooks.once("ready", () => {
  libWrapper!.register(
    ID,
    "game.i18n.format",
    (
      wrapped: typeof game.i18n.format,
      stringId: string,
      data?: Record<string, unknown>
    ): string => {
      if (game.i18n.lang === "it") {
        if (stringId === "PF2E.SpellArea") {
          data!.areaSize = convertFeet(data!.areaSize as number);
        }
        if (stringId === "PF2E.Item.Spell.PlaceMeasuredTemplate") {
          data!.size = convertFeet(data!.size as number);
        }
      }
      return wrapped(stringId, data);
    },
    "WRAPPER"
  );

  compatAutoanimations();
});

Hooks.once("i18nInit", () => {
  if (game.i18n.lang === "it") {
    const fallback: Translations = (game.i18n as any)._fallback;
    removeMismatchingTypes(fallback, game.i18n.translations);
    generateSpellcastingEntryTitles(fallback);
  }
});

Hooks.once("babele.ready", () => {
  game.pf2e.ConditionManager.initialize();
});

function heighteningPf2(value: any, translation?: any) {
  return value;
}

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

function timePf2(time: string | number | null, translation?: string) {
  if (!time || !convertEnabled) return time;
  if (translation) {
    return translation;
  }
  if (typeof time !== "string") {
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

function rangePf2(range: string | null | undefined, translation?: string) {
  if (!range || !convertEnabled) {
    return range;
  }
  if (translation) {
    return translation;
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
}

function distancePf2(distance: number | string) {
  if (!distance || !convertEnabled) {
    return distance;
  }
  const num = typeof distance === "string" ? parseInt(distance) : distance;
  return convertFeet(num);
}
