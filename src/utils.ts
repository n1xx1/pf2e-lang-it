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
