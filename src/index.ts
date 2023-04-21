import type { Translations } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/client/apps/i18n";
import { compatAutoanimations } from "./compat/autoanimations";
import { distancePf2 } from "./converter-distance";
import { fromPackPf2 } from "./converter-from-pack";
import { rangePf2 } from "./converter-range";
import { otherSpeedsPf2, speedPf2 } from "./converter-speeds";
import { timePf2 } from "./converter-time";
import { libWrapper } from "./libwrapper";
import { generateSpellcastingEntryTitles } from "./spellcasting-entry";
import { convertFeet, removeMismatchingTypes } from "./utils";

const LANG = "it";
const ID = "pf2e-lang-it";

const convertEnabled = false;

export function shouldConvertUnits() {
  return convertEnabled && game.i18n.lang === LANG;
}

Hooks.once("init", () => {
  if (typeof Babele === "undefined") {
    return;
  }

  Babele.get().register({
    module: ID,
    lang: LANG,
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
      if (shouldConvertUnits()) {
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
  if (game.i18n.lang === LANG) {
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
