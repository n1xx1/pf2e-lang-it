export function localizeWith(source: any, stringId: string) {
  const v = foundry.utils.getProperty(source, stringId);
  return typeof v === "string" ? v : stringId;
}

export function formatWith(source: any, stringId: string, data: any = {}) {
  let str = localizeWith(source, stringId);
  const fmt = /{[^}]+}/g;
  str = str.replace(fmt, (k) => {
    return data[k.slice(1, -1)];
  });
  return str;
}

export async function loadOriginalSystemLanguage() {
  const paths = [...game.system.languages.values()]
    .filter((x) => x.lang === "en")
    .map((x) => x.path);
  const languages = await Promise.all(
    paths.map(async (p) => {
      try {
        return foundry.utils.expandObject(await (await fetch(p)).json());
      } catch (e) {
        return {};
      }
    })
  );
  const trad: any = {};
  for (const lang of languages) {
    foundry.utils.mergeObject(trad, lang, { inplace: true });
  }
  return trad;
}

export function convertFeetString(v: string) {
  return convertFeet(parseInt(v.replace(/,/g, ""))).toLocaleString("it-IT");
}

export function convertMilesString(v: string) {
  return convertMiles(parseInt(v.replace(/,/g, ""))).toLocaleString("it-IT");
}

export function convertFeet(v: number) {
  if (v % 5 == 0) {
    return (v / 5) * 1.5;
  }
  return round(v * 0.3);
}

export function convertMiles(v: number) {
  return round(v * 1.6);
}

export function round(num: number) {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

type MergeOptions = {
  insertKeys: boolean;
  insertValues: boolean;
  overwrite: boolean;
  recursive: boolean;
  inplace: boolean;
  enforceTypes: boolean;
  performDeletions: boolean;
};

export function removeMismatchingTypes(fallback: any, other: any = {}) {
  for (let k of Object.keys(other)) {
    const replacement = other[k];
    const replacementType = getType(replacement);

    if (!fallback.hasOwnProperty(k)) {
      delete other[k];
      continue;
    }

    const original = fallback[k];
    const originalType = getType(original);

    if (replacementType === "Object" && originalType === "Object") {
      removeMismatchingTypes(original, replacement);
      continue;
    }

    if (originalType !== "undefined" && replacementType !== originalType) {
      delete other[k];
    }
  }

  return fallback;
}

type MergeInsertContext = Pick<
  MergeOptions,
  "insertKeys" | "insertValues" | "performDeletions"
>;

function _mergeInsert(
  original: any,
  k: string,
  v: any,
  {
    insertKeys,
    insertValues,
    performDeletions,
  }: Partial<MergeInsertContext> = {},
  _d: number
) {
  // Delete a key
  if (k.startsWith("-=") && performDeletions) {
    delete original[k.slice(2)];
    return;
  }

  const canInsert = (_d <= 1 && insertKeys) || (_d > 1 && insertValues);
  if (!canInsert) return;

  // Recursively create simple objects
  if (v?.constructor === Object) {
    original[k] = mergeObject({}, v, {
      insertKeys: true,
      inplace: true,
      performDeletions,
    });
    return;
  }

  // Insert a key
  original[k] = v;
}
