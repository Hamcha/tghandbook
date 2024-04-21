import { $el, zipBy } from "../../utils";
import { registerScript } from "../register";

interface ChangelogEntry {
  date: string;
  author: {
    name: string;
    avatar: string;
  };
  change: string;
  url: string;
}

registerScript("$Changelog", async (root) => {
  // @ts-expect-error This is replaced at compile time
  const changes: ChangelogEntry[] = import.meta.CHANGELOG;

  const container = root.querySelector<HTMLElement>(".tgh-changes")!;
  // Group changes by date
  const changesByDate = zipBy(changes, (ch) => {
    const dateStr = new Date(ch.date).toISOString();
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
        (ch) => ch.author.name,
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
            }),
          ),
        );
      });
    });
});
