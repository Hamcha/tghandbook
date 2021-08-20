import { parseTable, makeTable } from "../utils";
import { registerSearchEntries } from "../search";

export function processDrinks(root: HTMLElement): void {
  const drinkTables = ["#Basic_Drink_Ingredients", "#Mixed_Drinks"];
  drinkTables.forEach((selector) => {
    const table = root.querySelector<HTMLElement>(`${selector} .wikitable`);
    const drinks = parseTable(table).map((row) => {
      const foodBlock = document.createElement("td");
      foodBlock.innerHTML = `
<div class="food-pic">${row["Picture"].innerHTML}</div>
<div class="food-name">${row["Cocktail"].innerHTML}</div>
<p class="strength">${row["Strength"].innerHTML}</p>
<p class="description">${row["Drink Description"].innerHTML}</p>
<p class="notes">${row["Notes"].innerHTML}</p>
`;
      const ingredients = row["Ingredients"].innerHTML
        .split(/,|\+/gi)
        .map((s) => `<p>${s.trim()}</p>`);
      row["Ingredients"].innerHTML = ingredients.join("");
      return { Drink: foodBlock, Ingredients: row["Ingredients"] };
    });
    const betterTable = makeTable(["Drink", "Ingredients"], drinks);
    betterTable.className = "drink-ext wikitable";
    table.replaceWith(betterTable);
  });
}

export function drinkScript(root: HTMLElement): void {
  // Init fuzzy search with elements
  const foodEntries = Array.from(
    root.querySelectorAll<HTMLElement>(
      ".drink-ext tr:not(:first-child), .food-base-ext tr:not(:first-child), .food-ext tr:not(:first-child)"
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
}

export default {
  processDrinks,
  drinkScript,
};
