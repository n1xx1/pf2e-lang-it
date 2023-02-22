import { exec as childProcessExec } from "child_process";
import { writeFile } from "fs/promises";
import { promisify } from "util";

const exec = promisify(childProcessExec);

async function main() {
  const moduleVersion = process.env.MODULE_VERSION;
  const systemVersion = process.env.SYSTEM_VERSION;

  const releaseTag = process.env.RELEASE_TAG;
  const lastReleaseTag = process.env.LAST_RELEASE_TAG;

  const githubBase = process.env.GITHUB_SERVER_URL;
  const githubRepository = process.env.GITHUB_REPOSITORY;

  const { stdout } = await exec(
    `git log ${lastReleaseTag}..HEAD  --pretty="%s---separator---%H"`
  );

  const lines = stdout
    .trim()
    .split(/[\n\r]+/g)
    .map((line) => line.split(/---separator---/g))
    .map(
      ([message, hash]) =>
        `* ${message} [<${githubBase}/${githubRepository}/commit/${hash}>]`
    );

  const body = `
# Information

* Module Version: \`${moduleVersion}\`
* PF2e System Version: \`${systemVersion}\`
* Tag: \`${releaseTag}\`

# Changes

${lines.join("\n")}
`.trim();

  await writeFile("./dist/release.md", body + "\n");
}

main();
