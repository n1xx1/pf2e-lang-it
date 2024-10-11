import { Converter } from "./babele";
import { spellcastingEntries } from "./spellcasting-entry";

let dynamicMapping: CompendiumMapping | null = null;

export function hackCompendiumMappingClass() {
  const tc = game.babele.packs.contents[0];
  const CompendiumMapping: any = tc.mapping.constructor;
  dynamicMapping = new CompendiumMapping("Item");
}

// translations can be either an array of translations or an object
function getTranslationForItem(data: any, translations: any) {
  if (Array.isArray(translations)) {
    return translations.find((t) => t.id === data._id || t.id === data.name);
  } else {
    return translations[data._id] || translations[data.name];
  }
}

const sourceIdRegex =
  /^Compendium\.(?<namespace>[^\.]+)\.(?<compendium>[^\.]+)\.(?<type>Actor|Item|RollTable|JournalEntry|Macro|Item)\.(?<id>[^\.]+)(?:\.Item\.(?<itemId>[^\.]+))?$/;

// parse a sourceId reference (supports sub-items) and
// return the matching translation and mapping
function findTranslationSource(
  sourceId: string,
): null | [any, CompendiumMapping] {
  const m = sourceId.match(sourceIdRegex);
  if (!m) {
    return null;
  }

  const { namespace, compendium, id, itemId } = m.groups as Record<
    string,
    string
  >;
  const pack = game.babele.packs.get(`${namespace}.${compendium}`);
  if (!pack) {
    return null;
  }

  const foundryPack = game.packs.get(`${namespace}.${compendium}`)!;
  if (!foundryPack) {
    return null;
  }

  const referenced = foundryPack.index.get(id);
  if (!referenced) {
    return null;
  }

  const referencedName = (referenced as any).originalName ?? referenced.name;
  const referencedTranslation = pack.translationsFor({
    _id: id,
    name: referencedName,
  });

  if (!itemId) {
    return [referencedTranslation, pack.mapping];
  }

  if (!referencedTranslation?.items) {
    return null;
  }

  // try get the real item... will probably fail.
  // TODO: make it work with foundryPack.getDocument(id)
  const items: any[] = (foundryPack.get(id) as any)?.items;
  if (!items) {
    return null;
  }

  const name = items?.find((item: any) => item._id == itemId);
  return [
    getTranslationForItem({ _id: itemId, name }, referencedTranslation.items),
    dynamicMapping!,
  ];
}

export const fromPackPf2: Converter<any[]> = (items, translations) => {
  return items.map((data) => {
    let translationData;
    let translationSource;

    if (translations) {
      const translation = getTranslationForItem(data, translations);
      if (translation) {
        const { _source, ...rest } = translation;
        translationData = dynamicMapping!.map(data, rest);
        translationSource = _source ? `Compendium.${_source}` : null;
      }
    }

    const sourceId =
      translationSource ??
      data.flags?.core?.sourceId ??
      data._stats?.compendiumSource;
    if (sourceId) {
      const found = findTranslationSource(sourceId);
      if (found) {
        const [translationData1, mapping] = found;
        translationData = mergeObject(
          mapping.map(data, translationData1),
          translationData,
        );
      }
    } else if (data.type === "melee" || data.type === "ranged") {
      // find from equipment-srd
      const equipmentTranslation = game.babele.packs
        .get("pf2e.equipment-srd")!
        .translationsFor({ _id: "", name: data.name });

      translationData = dynamicMapping!.map(
        data,
        mergeObject(equipmentTranslation, translationData ?? {}, {
          inplace: false,
        }),
      );
    } else if (data.type === "spellcastingEntry") {
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
        { inplace: false },
      ),
      { inplace: false },
    );
  });
};
