import { parseTable, makeTable } from "../utils";
import { registerSearchEntries } from "../search";
import { registerProcess, registerScript } from "../register";

const page = "Critters";

registerProcess(page, (root) => {
  const tables = root.querySelectorAll<HTMLElement>(".wikitable");
  // Only process tables with a valid header
  Array.from(tables)
    .filter((table) =>
      table.querySelector("th:nth-child(2)")?.textContent?.includes("Name")
    )
    .forEach((table) => {
      const critters = parseTable(table).map((row) => {
        const critterBlock = document.createElement("td");
        critterBlock.innerHTML = `
	<div class="critter-pic btab-pic">${row.$row0.innerHTML}</div>
	  <div class="critter-name btab-name">${row["Name"].innerHTML}</div>
	  `;
        return {
          Critter: critterBlock,
          Description: row["Description"],
        };
      });
      const betterRoleTable = makeTable(["Critter", "Description"], critters);
      betterRoleTable.className = "critter-ext tgh-btab wikitable";
      table.replaceWith(betterRoleTable);
    });
});

registerScript(page, (root) => {
  const roles = Array.from(
    root.querySelectorAll<HTMLElement>(
      ".critter-ext > tbody > tr:not(:first-child)"
    )
  );
  registerSearchEntries(
    roles.map((element, id) => ({
      page,
      name: element.querySelector(".critter-name").textContent.trim(),
      element,
      alignment: "center",
      id,
    }))
  );
});
