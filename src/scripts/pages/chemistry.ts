import { registerSearchEntries } from "../search";
import { findParent } from "../utils";

export function processChemistry(root: HTMLElement): void {
  // Fix inconsistencies with <p> on random parts
  // Ideally I'd like a <p> or something on every part, wrapping it completely, but for now let's just kill 'em
  root
    .querySelectorAll(
      "table.wikitable > tbody > tr:not(:first-child) > td:nth-child(2), .tooltiptext"
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
      td.parentNode.replaceChild(tmp, td);
    });

  // Enrich "x part" with checkboxes and parts
  Array.from(root.querySelectorAll("td"))
    .filter((el) => el.textContent.indexOf(" part") >= 0)
    .forEach((el) => {
      el.innerHTML = el.innerHTML.replace(
        /((\d+)\s+(?:parts?|units?))(.*?(?:<\/a>|\n|$))/gi,
        (match, ...m) =>
          `<label class="bgus_part ${
            m[2].includes("</a>") ? "bgus_part_tooltip" : ""
          }" data-amount="${
            m[1]
          }"><input type="checkbox" class='bgus_checkbox bgus_hidden'/> <span class="bgus_part_label" data-src="${
            m[0]
          }">${m[0]}</span></label>${m[2].replace(
            /(<a .+?<\/a>)/gi,
            '<span class="bgus_nobreak bgus_nested_element">$1<span class="bgus_twistie"></span></span>'
          )}`
      );
    });

  // Wrap every recipe with extra metadata
  root.querySelectorAll<HTMLElement>(".bgus_part").forEach((el) => {
    if ("parts" in el.parentElement.dataset) {
      el.parentElement.dataset.parts = (
        parseInt(el.parentElement.dataset.parts, 10) +
        parseInt(el.dataset.amount, 10)
      ).toString();
    } else {
      el.parentElement.dataset.parts = el.dataset.amount;
    }
  });

  // Remove "Removed medicines" section
  const remTable = root.querySelector(
    "#Non-craftable_Medicines + h4 + p + div"
  );
  remTable.parentElement.removeChild(remTable);

  // Restructure recipes to work in a narrow window
  root
    .querySelectorAll<HTMLElement>("div[data-name] .wikitable.sortable tr")
    .forEach((row) => {
      const sectionEl = findParent(
        row,
        (sel) => "name" in sel.dataset && sel.dataset.name !== ""
      );
      const section = sectionEl.dataset.name;
      if (row.querySelector("td") === null) {
        // Remove unused rows if found
        const headers = row.querySelectorAll("th");
        headers.forEach((th, i) => {
          if (i < 2) {
            th.classList.add("table-head");
            return;
          }
          th.parentElement.removeChild(th);
        });
        return;
      }
      const rows = Array.from(row.querySelectorAll("td")).slice(1);
      let treatment: HTMLTableCellElement = null;
      let desc: HTMLTableCellElement = null;
      let metabolism: HTMLTableCellElement = null;
      let overdose: HTMLTableCellElement = null;
      let addiction: HTMLTableCellElement = null;
      // Handle special cases
      switch (section) {
        case "Components":
        case "Virology Recipes":
          [desc] = rows;
          break;
        case "Narcotics":
          [desc, metabolism, overdose, addiction] = rows;
          break;
        case "Explosive Strength":
        case "Other Reagents":
        case "Mutation Toxins":
          [desc, metabolism] = rows;
          break;
        default:
          // All fields
          [treatment, desc, metabolism, overdose, addiction] = rows;
      }
      const title = row.querySelector("th");
      let content = `<div class="reagent-header">${title.innerHTML}</div>`;
      if (treatment) {
        content += `<p class="treatment">${treatment.innerHTML}</p>`;
      }
      if (metabolism) {
        content += `<p class="metabolism">${metabolism.innerHTML}</p>`;
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
      title.classList.add("reagent-ext");
      title.innerHTML = content;
      if (desc) desc.parentElement.removeChild(desc);
      if (treatment) treatment.parentElement.removeChild(treatment);
      if (metabolism) metabolism.parentElement.removeChild(metabolism);
      if (overdose) overdose.parentElement.removeChild(overdose);
      if (addiction) addiction.parentElement.removeChild(addiction);
    });
}

export function chemistryScript(root: HTMLElement): void {
  // Add event to autofill child checkboxes
  root
    .querySelectorAll(".bgus_part_tooltip > .bgus_checkbox")
    .forEach((box: HTMLInputElement) => {
      const tooltip = box.parentElement.nextElementSibling;
      box.addEventListener("click", () => {
        tooltip
          .querySelectorAll(".bgus_checkbox")
          .forEach((el: HTMLInputElement) => {
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
    labels.forEach((el) => {
      const part = el.parentElement.dataset.amount;
      const total = el.parentElement.parentElement.dataset.parts;
      const amt = Math.ceil(ml * (part / total));
      el.innerHTML = `${amt} ml`;
      // Lookup tooltips
      let next = el.parentElement.nextElementSibling;
      while (next) {
        if (next.classList.contains("tooltip")) {
          const sublabels = [];
          next.querySelector(".tooltiptext").childNodes.forEach((ch) => {
            if (ch.classList && ch.classList.contains("bgus_part")) {
              sublabels.push(ch.querySelector(".bgus_part_label"));
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
      "table.wikitable > tbody > tr:not(:first-child)"
    )
  );
  registerSearchEntries(
    el.map((element, id) => ({
      page: "Guide_to_chemistry",
      name: element
        .querySelector("th .reagent-header")
        .textContent.trim()
        .replace("▮", ""),
      element,
      alignment: "center",
      id,
    }))
  );

  document.body.addEventListener("keydown", (ev) => {
    if (ev.shiftKey) {
      switch (ev.keyCode) {
        // SHIFT+C = Toggle checkboxes
        case 67: {
          root.classList.toggle("bgus_cbox");
          root
            .querySelectorAll(".bgus_checkbox:checked")
            .forEach((sel: HTMLInputElement) => {
              sel.checked = false;
            });
          break;
        }

        // SHIFT+B = Set whole size (beaker?) for parts/units
        case 66: {
          const size = parseInt(
            prompt("Write target ml (0 to reset)", "90"),
            10
          );
          if (Number.isNaN(size) || size <= 0) {
            // Reset to parts/unit
            root
              .querySelectorAll(".bgus_part_label")
              .forEach((sel: HTMLElement) => {
                sel.innerHTML = sel.dataset.src;
              });
            return;
          }
          setPartSize(
            root.querySelectorAll("td > .bgus_part > .bgus_part_label"),
            +size
          );
          break;
        }

        default:
        // Do nothing
      }
    }
  });
}

export default { chemistryScript, processChemistry };
