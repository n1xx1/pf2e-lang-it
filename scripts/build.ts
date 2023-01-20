import { packs } from "./packs";
import { build as esbuildBuild } from "esbuild";
import { join as pathJoin, resolve as pathResolve } from "path";
import {
  mkdir as fsMkdir,
  readFile as fsReadFile,
  rm as fsRm,
  writeFile as fsWriteFile,
} from "fs/promises";

const cwd = pathResolve(process.cwd());
const outdir = pathJoin(cwd, "dist");

await fsRm(outdir, { recursive: true });

await esbuildBuild({
  entryPoints: {
    module: "src/index.ts",
  },
  format: "esm",
  absWorkingDir: cwd,
  outdir,
  bundle: true,
});

// module.json

const moduleJson = pathJoin(cwd, "src", "module.json");
const distModuleJson = pathJoin(outdir, "module.json");

const repoName = process.env.GITHUB_REPOSITORY ?? "n1xx1/pf2e-lang-it";

await copyJsonFile(moduleJson, distModuleJson, (json) => ({
  ...json,
  url: `https://github.com/${repoName}`,
  manifest: `https://github.com/${repoName}/releases/latest/download/module.json`,
  download: `https://github.com/${repoName}/releases/latest/download/module.zip`,
}));

// translation files

const languageCode = "it";
const tradPath = pathJoin(cwd, "sources", "trad", languageCode);

const distLang = pathJoin(outdir, "lang");
await fsMkdir(distLang);
const tradLangPath = pathJoin(tradPath, `${languageCode}.json`);
const distLangPath = pathJoin(distLang, `${languageCode}.json`);
await copyJsonFile(tradLangPath, distLangPath);

const tradCompendiumPath = pathJoin(tradPath, "compendium");
const distLangCompendiums = pathJoin(distLang, "compendiums");
await fsMkdir(distLangCompendiums);
for (const [id, mapping] of Object.entries(packs)) {
  const source = pathJoin(tradCompendiumPath, `${id}.json`);
  const dist = pathJoin(distLangCompendiums, `pf2e.${id}.json`);

  await copyJsonFile(source, dist, (contents) => ({
    ...contents,
    mapping,
  })).catch(() => {});
}

process.exit();

type AnyJson = Record<string, unknown>;

async function copyJsonFile<T1 = AnyJson>(
  source: string,
  output: string,
  transformer: (x: T1) => AnyJson = (x) => x as AnyJson
) {
  await writeFileJson(output, transformer(await readFileJson(source)));
}

async function readFileJson<T = AnyJson>(file: string): Promise<T> {
  const contents = await fsReadFile(file, "utf-8");
  return JSON.parse(contents);
}

async function writeFileJson<T = AnyJson>(
  file: string,
  data: T
): Promise<void> {
  await fsWriteFile(file, JSON.stringify(data, null, 2));
}
