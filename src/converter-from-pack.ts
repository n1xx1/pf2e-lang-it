import { Converter } from "./babele";
import { spellcastingEntries } from "./spellcasting-entry";

let dynamicMapping = new CompendiumMapping("Item");

// translations can be either an array of translations or an object
function getTranslationForItem(data: any, translations: any) {
  if (Array.isArray(translations)) {
    return translations.find((t) => t.id === data._id || t.id === data.name);
  } else {
    return translations[data._id] || translations[data.name];
  }
}

// parse a sourceId reference (supports sub-items) and
// return the matching translation and mapping
function findTranslationSource(
  sourceId: string
): null | [any, CompendiumMapping] {
  const m = sourceId.match(
    /^Compendium\.pf2e\.([^\.]+).([^\.]+)(?:\.Item\.([^\.]+))?$/
  );
  if (m) {
    const [_, packName, id, itemId] = m;
    const pack = game.babele.packs.get(`pf2e.${packName}`);
    if (!pack) {
      return null;
    }

    const referencedTranslation = pack.translationsFor({ _id: id });
    if (!itemId) {
      return [referencedTranslation, pack.mapping];
    }

    if (referencedTranslation?.items) {
      const name = game.packs.get(`pf2e.${packName}`)!.index.get(itemId)!.name;

      return [
        getTranslationForItem(
          { _id: itemId, name },
          referencedTranslation.items
        ),
        dynamicMapping,
      ];
    }
  }
  return null;
}

export const fromPackPf2: Converter<any[]> = (items, translations) => {
  return items.map((data) => {
    let translationData;
    let translationSource;

    if (translations) {
      const translation = getTranslationForItem(data, translations);
      if (translation) {
        const { _source, ...rest } = translation;
        translationData = dynamicMapping.map(data, rest);
        translationSource = _source ? `Compendium.pf2e.${_source}` : null;
      }
    }

    const sourceId = translationSource ?? data.flags?.core?.sourceId;
    if (sourceId) {
      const found = findTranslationSource(sourceId);
      if (found) {
        const [translationData1, mapping] = found;
        translationData = mergeObject(
          mapping.map(data, translationData1),
          translationData
        );
      }
    }

    if (!sourceId && (data.type === "melee" || data.type === "ranged")) {
      // find from equipment-srd
      const equipmentTranslation = game.babele.packs
        .get("pf2e.equipment-srd")!
        .translationsFor({ _id: "", name: data.name });

      translationData = dynamicMapping.map(
        data,
        mergeObject(equipmentTranslation, translationData ?? {}, {
          inplace: false,
        })
      );
    }

    if (data.type === "spellcastingEntry") {
      const spellcastingEntryName = spellcastingEntries[data.name];
      if (spellcastingEntryName) {
        translationData = { name: spellcastingEntryName };
      }
    }

    if (!translationData) {
      return data;
    }

    return mergeObject(
      data,
      mergeObject(
        translationData,
        {
          translated: true,
          flags: {
            babele: {
              translated: true,
              hasTranslation: true,
              originalName: data.name,
            },
          },
        },
        { inplace: false }
      ),
      { inplace: false }
    );
  });
};
