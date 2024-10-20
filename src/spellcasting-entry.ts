import { formatWith, localizeWith } from "./utils";

export let spellcastingEntries: Record<string, string> = {};

export function generateSpellcastingEntryTitles(en: any) {
  spellcastingEntries = {};

  for (const prepKey of Object.values(CONFIG.PF2E.preparationType)) {
    for (const tradKey of Object.values(CONFIG.PF2E.magicTraditions)) {
      const originalPrep = localizeWith(en, prepKey);
      const originalTrad = localizeWith(en, tradKey);
      const originalSpellcasting = formatWith(en, "PF2E.SpellCastingFormat", {
        preparationType: originalPrep,
        traditionSpells: originalTrad,
      });

      const translatedPrep = game.i18n.localize(prepKey);
      const translatedTrad = game.i18n.localize(tradKey);
      const translatedSpellcasting = game.i18n.format(
        "PF2E.SpellCastingFormat",
        {
          preparationType: translatedPrep,
          traditionSpells: translatedTrad,
        },
      );

      spellcastingEntries[originalSpellcasting] = translatedSpellcasting;
    }
  }
}
