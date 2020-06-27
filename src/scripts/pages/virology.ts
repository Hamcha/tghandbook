import { parseTable, makeTable } from "../utils";
import { registerSearchEntries } from "../search";

export function processVirology(root: HTMLElement): void {
  const diseaseTable = root.querySelector<HTMLElement>(
    "#Simple_Diseases .wikitable"
  );
  const diseases = parseTable(diseaseTable).map((row) => {
    const diseaseBlock = document.createElement("td");
    diseaseBlock.innerHTML = `
    <div class="disease-name">${row["Disease Name"].innerHTML}</div>
    <p class="vector">${row["Vector Name"].innerHTML}</p>
    <p class="source">${row["Source"].innerHTML}</p>
    <p class="spread">${row["Spread"].innerHTML}</p>
    <p class="description">${row["Description"].innerHTML}</p>
    `;
    return {
      Disease: diseaseBlock,
      Cure: row["Cure"],
    };
  });

  const diseaseBetterTable = makeTable(["Disease", "Cure"], diseases);
  diseaseBetterTable.className = "disease-ext wikitable";
  diseaseTable.replaceWith(diseaseBetterTable);

  const symptomsTable = root.querySelector<HTMLElement>(
    "#Symptoms_Table .wikitable"
  );
  const symptoms = parseTable(symptomsTable);
  //symptomsTable.replaceWith(document.createElement("span"));
}

export function virologyScript(root: HTMLElement): void {
  // Init fuzzy search with elements
  const el = Array.from(
    root.querySelectorAll<HTMLElement>(".disease-ext tr:not(:first-child)")
  );
  registerSearchEntries(
    el.map((element, id) => ({
      page: "Infections",
      name: element.querySelector(".disease-name").textContent.trim(),
      element,
      alignment: "center",
      id,
    }))
  );
}

export default {
  processVirology,
  virologyScript,
};
