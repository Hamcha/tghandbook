import fs from "fs";
import https from "https";
import { Plugin } from "node_modules/vite/dist/node/index";

export interface Commit {
  sha: string;
  author: {
    login: string;
    avatar_url: string;
  };
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
  };
  html_url: string;
}

interface ChangelogEntry {
  date: Date;
  author: {
    name: string;
    avatar: string;
  };
  change: string;
  url: string;
}

function parseChanges(commits: Commit[]): ChangelogEntry[] {
  const clCommits = commits
    // Filter out any commit that doesn't have a CL entry
    .filter((cl) => cl.commit.message.includes("\n/CL"))
    // Split multi-entry CL into their own mini-commits
    .reduce<ChangelogEntry[]>((list, cl) => {
      const message = cl.commit.message.split("\n").map((line) => line.trim());
      const clStartIndex = message.indexOf("CL");
      const clEndIndex = message.indexOf("/CL");
      const entries = message
        .splice(clStartIndex + 1, clEndIndex - clStartIndex - 1)
        .map((entry) => ({
          date: new Date(cl.commit.author.date),
          author: {
            name: cl.commit.author.name,
            avatar: cl.author.avatar_url,
          },
          change: entry,
          url: cl.html_url,
        }));
      return [...list, ...entries];
    }, []);
  return clCommits;
}

let changelog = null;
async function getChangelog(): Promise<string> {
  // Commit API has low quota, use mocks while developing
  if (process.env.NODE_ENV === "development") {
    const test = await fs.promises.readFile(`./plugins/mock/clmock.json`, {
      encoding: "utf-8",
    });
    return JSON.stringify(parseChanges(JSON.parse(test)));
  }
  // Don't fetch the changelog for every file!
  if (changelog != null) {
    return changelog;
  }
  const result = await new Promise<string>((resolve, reject) => {
    https
      .get(
        {
          host: "api.github.com",
          path: "/repos/Hamcha/tghandbook/commits?sha=master",
          headers: {
            "User-Agent": "tghandbook",
          },
        },
        (resp) => {
          let data = "";

          resp.on("data", (chunk) => {
            data += chunk;
          });

          // The whole response has been received. Print out the result.
          resp.on("end", () => {
            resolve(data);
          });
        }
      )
      .on("error", (err) => {
        reject(err);
      });
  });
  const parsed = JSON.stringify(parseChanges(JSON.parse(result)));
  changelog = parsed;
  return parsed;
}

export default function createPlugin(): Plugin {
  return {
    enforce: "pre",
    async transform(code) {
      if (code.includes("import.meta.CHANGELOG")) {
        return {
          code: code.replace("import.meta.CHANGELOG", await getChangelog()),
        };
      }
      return { code };
    },
  };
}
