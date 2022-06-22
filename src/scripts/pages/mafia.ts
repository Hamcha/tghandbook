import { parseTable, makeTable } from "../utils";
import { registerSearchEntries } from "../search";
import { registerProcess, registerScript } from "../register";

const page = "Mafia";

registerProcess(page, (root) => {
  const tables = root.querySelectorAll<HTMLElement>(".wikitable");
  // Only process tables with a "Role" header
  Array.from(tables)
    .filter((table) => table.querySelector("th")?.textContent?.includes("Role"))
    .forEach((table) => {
      const roles = parseTable(table).map((row) => {
        const roleBlock = document.createElement("td");
        roleBlock.innerHTML = `
	  <div class="role-name btab-name">${row["Role"].innerHTML}</div>
	  <p class="description">${row["Description"].innerHTML}</p>
	  `;
        return {
          Role: roleBlock,
          "How to play": row["How to Play"],
        };
      });
      const betterRoleTable = makeTable(["Role", "How to play"], roles);
      betterRoleTable.className = "role-ext tgh-btab wikitable";
      table.replaceWith(betterRoleTable);
    });
});

registerScript(page, (root) => {
  const roles = Array.from(
    root.querySelectorAll<HTMLElement>(
      ".role-ext > tbody > tr:not(:first-child)"
    )
  );
  registerSearchEntries(
    roles.map((element, id) => ({
      page: "Mafia",
      name: element.querySelector(".role-name").textContent.trim(),
      element,
      alignment: "center",
      id,
    }))
  );
});
