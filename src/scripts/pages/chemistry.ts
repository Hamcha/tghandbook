import { registerSearchEntries } from "../search";
import { registerProcess, registerScript } from "../register";
import { findParent } from "../utils";
import { stripStart } from "../../utils";

const page = "Guide_to_chemistry";

registerProcess(page, (root) => {
  // Fix inconsistencies with <p> on random parts
  // Ideally I'd like a <p> or something on every part, wrapping it completely, but for now let's just kill 'em
  root
    .querySelectorAll(
      "table.wikitable > tbody > tr:not(:first-child) > td:nth-child(2), .tooltiptext",
    )
    .forEach((td) => {
      const tmp = td.cloneNode() as HTMLElement;
      // The cast to Array is necessary because, while childNodes's NodeList technically has a forEach method, it's a live list and operations mess with its lenght in the middle of the loop.
      // Nodes can only have one parent so append removes them from the original NodeList and shifts the following one back into the wrong index.
      Array.from(td.childNodes).forEach((el) => {
        if (el instanceof HTMLParagraphElement) {
          tmp.append(...el.childNodes);
        } else {
          tmp.append(el);
        }
      });
      td.parentNode!.replaceChild(tmp, td);
    });

  // Enrich "x part" with checkboxes and parts
  Array.from(root.querySelectorAll("td"))
    .filter((el) => el.textContent!.indexOf(" part") >= 0)
    .forEach((el) => {
      el.innerHTML = el.innerHTML.replace(
        /((\d+)\s+(?:parts?|units?))(.*?(?:<\/a>|\n|$))/gi,
        (_, ...[text, amount, reagent]) =>
          `<label class="bgus_part ${
            reagent.includes("</a>") ? "bgus_part_tooltip" : ""
          }" data-amount="${amount}"><input type="checkbox" class='bgus_checkbox bgus_hidden'/> <span class="bgus_part_label" data-src="${text}">${text}</span></label>${reagent.replace(
            /(<a .+?<\/a>)/gi,
            '<span class="bgus_nobreak bgus_nested_element">$1<span class="bgus_twistie"></span></span>',
          )}`,
      );
    });

  // Wrap every recipe with extra metadata
  root.querySelectorAll<HTMLElement>(".bgus_part").forEach((el) => {
    if ("parts" in el.parentElement!.dataset) {
      el.parentElement!.dataset.parts = (
        parseInt(el.parentElement!.dataset.parts || "0", 10) +
        parseInt(el.dataset.amount || "0", 10)
      ).toString();
    } else {
      el.parentElement!.dataset.parts = el.dataset.amount;
    }
  });

  // Restructure recipes to work in a narrow window
  root
    .querySelectorAll<HTMLElement>("div[data-name] .wikitable.sortable tr")
    .forEach((row) => {
      const sectionEl = findParent(
        row,
        (sel) => "name" in sel.dataset && sel.dataset.name !== "",
      )!;
      const section = sectionEl.dataset.name;
      if (row.querySelector("td") === null) {
        // Remove unused rows if found
        const headers = row.querySelectorAll("th");
        headers.forEach((th, i) => {
          if (i < 2) {
            th.classList.add("table-head");
            return;
          }
          th.parentElement!.removeChild(th);
        });
        return;
      }
      const rows = Array.from(row.querySelectorAll("td")).slice(1);
      let conditions: HTMLTableCellElement | null = null;
      let explosive: HTMLTableCellElement | null = null;
      let ph: HTMLTableCellElement | null = null;
      let treatment: HTMLTableCellElement | null = null;
      let desc: HTMLTableCellElement | null = null;
      let metabolism: HTMLTableCellElement | null = null;
      let overdose: HTMLTableCellElement | null = null;
      let addiction: HTMLTableCellElement | null = null;
      // Handle special cases
      switch (section) {
        case "Components":
          [ph, desc] = rows;
          break;
        case "Virology Recipes":
          [desc] = rows;
          break;
        case "Narcotics":
          [ph, desc, metabolism, overdose, addiction] = rows;
          break;
        case "Other Reagents":
          [ph, desc, metabolism] = rows;
          break;
        case "Explosive Strength":
          [conditions, desc, explosive] = rows;
          break;
        case "Mutation Toxins":
          [desc, metabolism] = rows;
          break;
        default:
          // All fields
          [ph, treatment, desc, metabolism, overdose, addiction] = rows;
      }
      const title = row.querySelector("th")!;
      // Split chem name from ph related info
      const purity = title.querySelector("p");
      const purityData = purity?.innerHTML;
      purity?.remove();
      let content = `<div class="reagent-header btab-name">${title.innerHTML}</div>`;
      if (purityData) {
        content += `<p class="ph-data">${stripStart(purityData, "<br>")}</p>`;
      }
      if (treatment) {
        content += `<p class="treatment">${treatment.innerHTML}</p>`;
      }
      if (metabolism) {
        content += `<p class="metabolism">${metabolism.innerHTML}</p>`;
      }
      if (conditions) {
        content += `<p class="conditions">${conditions.innerHTML}</p>`;
      }
      if (explosive) {
        content += `<p class="explosive">${explosive.innerHTML}</p>`;
      }
      if (addiction && addiction.innerHTML.trim() !== "N/A") {
        content += `<p class="addiction">${addiction.innerHTML}</p>`;
      }
      if (overdose && overdose.innerHTML.trim() !== "N/A") {
        content += `<p class="overdose">${overdose.innerHTML}</p>`;
      }
      if (desc) {
        content += `<p>${desc.innerHTML}</p>`;
      }
      if (ph) {
        content += `<div class="ph">${ph.innerHTML}</div>`;
      }
      title.classList.add("reagent-ext");
      title.innerHTML = content;
      desc?.remove();
      treatment?.remove();
      metabolism?.remove();
      conditions?.remove();
      explosive?.remove();
      overdose?.remove();
      addiction?.remove();
      ph?.remove();
    });

  // Set every table to be "better" format
  root.querySelectorAll<HTMLElement>(".wikitable.sortable").forEach((table) => {
    table.classList.add("tgh-btab");
  });
});

registerScript(page, (root) => {
  // Add event to autofill child checkboxes
  root
    .querySelectorAll<HTMLInputElement>(".bgus_part_tooltip > .bgus_checkbox")
    .forEach((box) => {
      const tooltip = box.parentElement!.nextElementSibling;
      box.addEventListener("click", () => {
        tooltip
          ?.querySelectorAll<HTMLInputElement>(".bgus_checkbox")
          .forEach((el) => {
            el.checked = box.checked;
          });
      });
    });

  // Add event to collapse subsections
  root.querySelectorAll(".bgus_nested_element").forEach((twistie) => {
    twistie.addEventListener("click", () => {
      twistie.classList.toggle("bgus_collapsed");
    });
  });

  const setPartSize = (labels, ml) => {
    labels.forEach((el: HTMLElement) => {
      const parent = el.parentElement!;
      const part = parseFloat(parent.dataset.amount || "0");
      const total = parseFloat(parent.parentElement!.dataset.parts || "0");
      const amt = Math.ceil(ml * (part / total));
      el.innerHTML = `${amt} ml`;
      // Lookup tooltips
      let next = parent.nextElementSibling;
      while (next) {
        if (next.classList.contains("tooltip")) {
          const sublabels: HTMLElement[] = [];
          next.querySelector(".tooltiptext")?.childNodes.forEach((ch) => {
            // Must be an element
            if (!(ch instanceof Element)) {
              return;
            }
            if (ch.classList && ch.classList.contains("bgus_part")) {
              const label = ch.querySelector<HTMLElement>(".bgus_part_label");
              if (!label) {
                return;
              }
              sublabels.push(label);
            }
          });
          setPartSize(sublabels, amt);
        }
        if (next.classList.contains("bgus_part")) {
          // Done searching
          break;
        }
        next = next.nextElementSibling;
      }
    });
  };

  // Init fuzzy search with elements
  const el = Array.from(
    root.querySelectorAll<HTMLElement>(
      "table.wikitable > tbody > tr:not(:first-child)",
    ),
  );

  const elements = Array.from(
    root.querySelectorAll<HTMLElement>(
      "table.wikitable > tbody > tr:not(:first-child) th .reagent-header",
    ),
  );

  registerSearchEntries(
    elements.map((element, id) => ({
      page,
      name: element.textContent!.trim().replace(/\n.+$/gm, "").replace("▮", ""),
      element: element.parentElement!,
      alignment: "center",
      id,
    })),
  );

  document.body.addEventListener("keydown", (ev) => {
    if (ev.shiftKey) {
      switch (ev.code) {
        // SHIFT+C = Toggle checkboxes
        case "KeyC": {
          root.classList.toggle("bgus_cbox");
          root
            .querySelectorAll<HTMLInputElement>(".bgus_checkbox:checked")
            .forEach((sel) => {
              sel.checked = false;
            });
          break;
        }

        // SHIFT+B = Set whole size (beaker?) for parts/units
        case "KeyB": {
          const size = parseInt(
            prompt("Write target ml (0 to reset)", "90") || "0",
            10,
          );
          if (Number.isNaN(size) || size <= 0) {
            // Reset to parts/unit
            root
              .querySelectorAll<HTMLElement>(".bgus_part_label")
              .forEach((sel) => {
                sel.innerHTML = sel.dataset.src || "";
              });
            return;
          }
          setPartSize(
            root.querySelectorAll("td > .bgus_part > .bgus_part_label"),
            +size,
          );
          break;
        }

        default:
        // Do nothing
      }
    }
  });

  // Prettify reaction conditions
  const reactionPropertyRegexp = /<b>(.+):<\/b>(.+)/i;
  el.forEach((element) => {
    element.querySelectorAll<HTMLElement>(".ph").forEach((ph) => {
      // Prepare table
      const extras: string[] = [];
      const table = document.createElement("table");
      const tableHeaderRow = document.createElement("tr");
      const tableValueRow = document.createElement("tr");
      table.appendChild(tableHeaderRow);
      table.appendChild(tableValueRow);

      // Parse parameters
      ph.innerHTML.split("<br>").forEach((prop) => {
        if (prop.trim() === "N/A") {
          return;
        }

        const matcher = reactionPropertyRegexp.exec(prop);
        if (!matcher) {
          extras.push(prop);
          return;
        }

        const [reactionProperty, propValue] = matcher
          .slice(1)
          .map((s) => s.trim());

        const header = document.createElement("th");
        header.appendChild(document.createTextNode(reactionProperty));
        tableHeaderRow.appendChild(header);
        const value = document.createElement("td");
        value.appendChild(document.createTextNode(propValue));
        tableValueRow.append(value);
      });

      // Clear and re-add prettified data
      ph.innerHTML = "";
      if (tableHeaderRow.children.length > 0) {
        ph.appendChild(table);
      }
      ph.innerHTML += `<p>${extras.join("<br>")}</p>`;
      ph.classList.add("ph-ext");
    });
  });
});
