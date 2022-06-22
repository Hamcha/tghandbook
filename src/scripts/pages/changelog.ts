import { $el, zipBy } from "../../utils";
import { registerScript } from "../register";

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

registerScript("$Changelog", async (root) => {
  const changes = import.meta.CHANGELOG;
  const changelogEntries = parseChanges(changes as Commit[]);

  const container = root.querySelector<HTMLElement>(".tgh-changes");
  // Group changes by date
  const changesByDate = zipBy(changelogEntries, (ch) => {
    const dateStr = ch.date.toISOString();
    return dateStr.substring(0, dateStr.indexOf("T"));
  });

  Object.keys(changesByDate)
    .sort()
    .reverse()
    .forEach((date) => {
      const header = $el("h3", { className: "tgh-change-date" }, date);
      container.appendChild(header);

      const changesByAuthor = zipBy(
        changesByDate[date],
        (ch) => ch.author.name
      );

      Object.keys(changesByAuthor).forEach((author) => {
        container.appendChild(
          $el(
            "article",
            { className: "tgh-change-entry" },
            [
              "header",
              ["img", { src: changesByAuthor[author][0].author.avatar }],
              [
                "div",
                { className: "author" },
                changesByAuthor[author][0].author.name,
              ],
            ],
            ...changesByAuthor[author].map((ch) => {
              const separator = ch.change.indexOf(":");
              const tag = ch.change.substring(0, separator).trim();
              const message = ch.change.substring(separator + 1).trim();
              return [
                "div",
                { className: "tgh-change-info" },
                ["div", { className: `tgh-change-tag tag-${tag}` }, tag],
                message,
                [
                  "a",
                  {
                    href: ch.url,
                    className: "tgh-change-more",
                    title: "Go to commit",
                    target: "_blank",
                  },
                  "🔗",
                ],
              ];
            })
          )
        );
      });
    });
});
