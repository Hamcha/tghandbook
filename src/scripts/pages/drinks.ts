import { parseTable, makeTable } from "../utils";
import { registerSearchEntries } from "../search";
import { registerProcess, registerScript } from "../register";

const page = "Guide_to_drinks";

registerProcess(page, (root) => {
  const mixDrinks: HTMLTableElement[] = [],
    junkDrinks: HTMLTableElement[] = [];
  root.querySelectorAll<HTMLTableElement>(".wikitable").forEach((table) => {
    const row = table.querySelector("tr");
    // Make sure one of the rows is the picture (so we don't get random tables)
    if (!row.innerHTML.includes("Picture")) {
      return;
    }

    // Junk drinks have 3 rows (picture, name, description)
    if (row.childElementCount === 3) {
      junkDrinks.push(table);
      return;
    }

    // Everything else is either a base drink or a mixed drink drink
    mixDrinks.push(table);
  });
  mixDrinks.forEach((table) => {
    const drinks = parseTable(table).map((row) => {
      const drinkBlock = document.createElement("td");
      drinkBlock.innerHTML = `
<div class="food-pic btab-pic">${row["Picture"].innerHTML}</div>
<div class="food-name btab-name">${row["Cocktail"].innerHTML}</div>
<p class="strength">${row["Strength"].innerHTML}</p>
<p class="description">${row["Drink Description"].innerHTML}</p>
${"Notes" in row ? `<p class="notes">${row["Notes"].innerHTML}</p>` : ""}
`;
      const ingredients = row["Ingredients"].innerHTML
        .split(/,|\+/gi)
        .map((s) => `<p>${s.trim()}</p>`);
      row["Ingredients"].innerHTML = ingredients.join("");
      return { Drink: drinkBlock, Ingredients: row["Ingredients"] };
    });
    const betterTable = makeTable(["Drink", "Ingredients"], drinks);
    betterTable.className = "drink-ext tgh-btab wikitable";
    table.replaceWith(betterTable);
  });

  junkDrinks.forEach((table) => {
    const recipeBook = parseTable(table).map((row) => {
      const bookBlock = document.createElement("td");
      bookBlock.innerHTML = `<div class="food-pic btab-pic">${row["Picture"].innerHTML}</div>
      <div class="food-name btab-name">${row["Dispenses"].innerHTML}</div>`;
      return { Dispenses: bookBlock, Description: row["Description"] };
    });
    const betterBookTable = makeTable(["Dispenses", "Description"], recipeBook);
    betterBookTable.className = "junk-ext tgh-btab wikitable";
    table.replaceWith(betterBookTable);
  });
});

registerScript(page, (root) => {
  // Init fuzzy search with elements
  const foodEntries = Array.from(
    root.querySelectorAll<HTMLElement>(
      ".drink-ext tr:not(:first-child), .food-base-ext tr:not(:first-child), .food-ext tr:not(:first-child), .junk-ext tr:not(:first-child)"
    )
  );
  registerSearchEntries(
    foodEntries.map((element, id) => ({
      page: "Guide_to_drinks",
      name: element.querySelector(".food-name").textContent.trim(),
      element,
      alignment: "center",
      id,
    }))
  );
});
