import { parseTable, makeTable } from "../utils";
import { registerSearchEntries } from "../search";

export function processGhettochem(root: HTMLElement): void {
  const grindableTable = root.querySelector<HTMLElement>(
    "#Grindables .wikitable"
  );
  const grindables = parseTable(grindableTable).map((row) => {
    const grindableBlock = document.createElement("td");
    grindableBlock.innerHTML = `
    <div class="grindable-name btab-name">${row["Chemical"].innerHTML}</div>
    <p class="notes">${row["Notes"]?.innerHTML ?? ""}</p>
    `;
    return {
      Chemical: grindableBlock,
      Sources: row["Sources"],
    };
  });

  const grindableBetterTable = makeTable(["Chemical", "Sources"], grindables);
  grindableBetterTable.className = "grindable-ext tgh-btab wikitable";
  grindableTable.replaceWith(grindableBetterTable);
}

export function ghettochemScript(root: HTMLElement): void {
  // Init fuzzy search with elements
  const grindables = Array.from(
    root.querySelectorAll<HTMLElement>(".grindable-ext tr:not(:first-child)")
  );
  registerSearchEntries(
    grindables.map((element, id) => ({
      page: "Guide_to_Ghetto_Chemistry",
      name: element.querySelector(".grindable-name").textContent.trim(),
      element,
      alignment: "center",
      id,
    }))
  );
}

export default {
  processGhettochem,
  ghettochemScript,
};
