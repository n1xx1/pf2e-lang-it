import { exec as childProcessExec } from "child_process";
import { writeFile } from "fs/promises";
import { promisify } from "util";
import { Octokit } from "@octokit/core";
import * as path from "path";

const exec = promisify(childProcessExec);

const githubOwner = "n1xx1";
const githubRepo = "pf2e-lang-it";

const githubSourcesOwner = "n1xx1";
const githubSourcesRepo = "foundryvtt-pf2e-language-sources";

async function main() {
  const repoUrl = `https://github.com/${githubOwner}/${githubRepo}`;

  const moduleVersion = process.env.MODULE_VERSION as string;
  const systemVersion = process.env.SYSTEM_VERSION as string;
  const releaseTag = process.env.RELEASE_TAG as string;
  const lastReleaseTag = process.env.LAST_RELEASE_TAG as string;

  const git = new Octokit({ auth: process.env.GITHUB_TOKEN as string });

  const sourcesHash = await getCurrentSourcesHash();
  const lastSourcesHash = await getLastSourcesHash(git, lastReleaseTag);

  const moduleChanges = (await getChanges(git, lastReleaseTag, "HEAD"))
    .filter(includeCommit)
    .map((c) => {
      const link = `<${repoUrl}/commit/${c.hash}>`;
      const by = c.author ? ` by ${c.author}` : "";
      return `* ${c.message} [${link}${by}]`;
    });

  const translationChanges = (
    await getSourcesAuthors(git, lastSourcesHash, sourcesHash)
  ).map((a) => {
    return `* ${a.changes} changes by ${a.author}`;
  });

  const body = `
# Information

* Module Version: \`${moduleVersion}\`
* PF2e System Version: \`${systemVersion}\`
* Tag: \`${releaseTag}\`

# Module Changes

${moduleChanges.join("\n")}

# Translation Changes

${translationChanges.join("\n")}

`.trim();

  console.log(body + "\n");
  await writeFile("./dist/release.md", body + "\n");
}

function includeCommit(c: Awaited<ReturnType<typeof getChanges>>[0]) {
  if (c.message.startsWith("🔖") || c.message.startsWith(":bookmark:")) {
    return false;
  }
  return true;
}

async function getCurrentSourcesHash() {
  const { stdout } = await exec(
    `git ls-tree HEAD sources --format="%(objectname)"`,
  );
  return stdout.trim();
}

async function getLastSourcesHash(git: Octokit, lastReleaseTag: string) {
  const { data: lastSubmoduleHashData } = await git.request(
    "GET /repos/{owner}/{repo}/contents/{path}",
    {
      owner: "n1xx1",
      repo: "pf2e-lang-it",
      path: "sources",
      ref: lastReleaseTag,
    },
  );
  if (
    Array.isArray(lastSubmoduleHashData) ||
    lastSubmoduleHashData.type !== "submodule"
  ) {
    throw new Error("invalid data");
  }
  return lastSubmoduleHashData.sha;
}

async function gitGetSourcesCommit(git: Octokit, ref: string) {
  const { data } = await git.request(
    "GET /repos/{owner}/{repo}/commits/{ref}",
    {
      owner: githubSourcesOwner,
      repo: githubSourcesRepo,
      ref,
    },
  );
  return data;
}

async function gitGetCommit(git: Octokit, ref: string) {
  const { data } = await git.request(
    "GET /repos/{owner}/{repo}/commits/{ref}",
    {
      owner: githubOwner,
      repo: githubRepo,
      ref,
    },
  );
  return data;
}

function getHandle(
  commit: Awaited<ReturnType<typeof gitGetCommit>>,
  base?: string,
) {
  if (commit.author?.login) {
    return `@${commit.author.login}`;
  }
  return base ?? "unknown";
}

async function getChanges(git: Octokit, refFrom: string, refTo: string) {
  let { stdout, stderr } = await exec(
    `git log ${refFrom}..${refTo} --format="%s----%H----%an"`,
  );

  const commits = stdout
    .trim()
    .split(/[\n\r]+/g)
    .map((line) => line.split(/----/g))
    .map(([message, hash, author]) => ({ message, hash, author }));

  return await Promise.all(
    commits.map(async (c) => {
      const commit = await gitGetCommit(git, c.hash);
      return { ...c, author: getHandle(commit, c.author) };
    }),
  );
}

async function getSourcesAuthors(git: Octokit, refFrom: string, refTo: string) {
  let { stdout, stderr } = await exec(
    `git log ${refFrom}..${refTo} --format="%an----%H----%s" -- trad/it`,
    { cwd: path.resolve("./sources") },
  );
  stdout = stdout.trim();
  if (stdout.length === 0) return [];

  const commits = await Promise.all(
    stdout
      .split(/[\n\r]+/g)
      .map((line) => line.split(/----/g))
      .map(([author, hash, message]) => ({ author, hash, message }))
      .map(async (c) => {
        const commit = await gitGetSourcesCommit(git, c.hash);
        return { ...c, author: getHandle(commit, c.author), data: commit };
      }),
  );

  return [...groupBy(commits, (c) => c.author).entries()].map(
    ([author, commits]) => ({
      author,
      changes: commits.reduce((p, c) => p + (c.data.stats?.total ?? 0), 0),
    }),
  );
}

async function getCommitStats(git: Octokit, ref: string) {
  const data = await gitGetSourcesCommit(git, ref);
  return data.stats?.total ?? 1;
}

async function getCommitStatsAndAuthor(git: Octokit, ref: string) {
  const data = await gitGetSourcesCommit(git, ref);
  const user = data.author?.login ?? data.committer?.login ?? null;
  const url = data.author?.html_url ?? data.committer?.html_url ?? null;
  const total = data.stats?.total ?? 1;
  return { user, url, total };
}

function groupBy<V, K>(arr: V[], keyGetter: (v: V) => K): Map<K, V[]> {
  const map = new Map();
  for (const item of arr) {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  }
  return map;
}

main();
