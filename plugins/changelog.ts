import fs from "fs";
import https from "https";
import { Plugin } from "node_modules/vite/dist/node/index";

let changelog = null;
async function getChangelog(): Promise<string> {
  // Commit API has low quota, use mocks while developing
  if (process.env.NODE_ENV === "development") {
    const test = await fs.promises.readFile(`./plugins/mock/clmock.json`, {
      encoding: "utf-8",
    });
    return test;
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
  changelog = result;
  return result;
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
