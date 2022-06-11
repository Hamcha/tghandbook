import { parseTable, makeTable } from "../utils";
import { registerSearchEntries } from "../search";

export function processFood(root: HTMLElement): void {
  // Set up the two kinds of tables and populate them
  const baseFoodTables: HTMLTableElement[] = [],
    foodRecipesTables: HTMLTableElement[] = [];
  root.querySelectorAll<HTMLTableElement>(".wikitable").forEach((table) => {
    const row = table.querySelector("tr");
    // Make sure one of the rows is the picture (so we don't get random tables)
    if (!row.innerHTML.includes("Picture")) {
      return;
    }

    // Base food has 3 rows (picture, name, how to acquire)
    if (row.childElementCount === 3) {
      baseFoodTables.push(table);
    }
    // Food recipes has 5 rows (picture, name, ingredients, nutrition, notes)
    if (row.childElementCount > 3) {
      foodRecipesTables.push(table);
    }
  });

  baseFoodTables.forEach((table) => {
    const headers = table
      .querySelector("tr")
      .querySelectorAll<HTMLTableRowElement>("th,td");
    const title = headers[1].innerText.trim();
    const process = headers[2].innerText.trim();
    const foods = [];
    table.querySelectorAll("tr:not(:first-child)").forEach((row) => {
      const fields = row.querySelectorAll("th,td");
      const foodBlock = document.createElement("td");
      foodBlock.innerHTML = `<div class="food-block">
<div class="food-pic btab-pic">${fields[0].innerHTML}</div>
<div class="food-name btab-name">${fields[1].innerHTML}</div>
</div>
`;
      foods.push({
        [title]: foodBlock,
        [process]: fields[2],
      });
    });
    const betterTable = makeTable([title, process], foods);
    betterTable.className = "food-base-ext tgh-btab wikitable";
    table.replaceWith(betterTable);
  });

  const recipeBookTable = root.querySelector<HTMLElement>(
    `#Recipe_Books .wikitable`
  );
  const recipeBook = parseTable(recipeBookTable).map((row) => {
    const bookBlock = document.createElement("td");
    bookBlock.innerHTML = `<div class="food-pic btab-pic">${row["Picture"].innerHTML}</div>
<div class="food-name btab-name">${row["Book"].innerHTML}</div>
<p class="unlocks">${row["Unlocks"].innerHTML}</p>
<p class="notes">${row["Notes"].innerHTML}</p>
`;
    return { Book: bookBlock, "Where to get": row["Where to get"] };
  });
  const betterBookTable = makeTable(["Book", "Where to get"], recipeBook);
  betterBookTable.className = "book-ext wikitable";
  recipeBookTable.replaceWith(betterBookTable);

  foodRecipesTables.forEach((table) => {
    const headers = table
      .querySelector("tr")
      .querySelectorAll<HTMLTableRowElement>("td,th");
    const picture = headers[0].innerText.trim();
    const title = headers[1].innerText.trim();
    const ingredients = headers[2].innerText.trim();
    const recipes = parseTable(table).map((row) => {
      const foodBlock = document.createElement("td");
      foodBlock.innerHTML = `
<div class="food-pic btab-pic">${row[picture].innerHTML}</div>
<div class="food-name btab-name">${row[title].innerHTML}</div>
${
  "Nutritional Value" in row
    ? `<p class="nutrition">${row["Nutritional Value"].innerHTML}</p>`
    : ""
}
${"Notes" in row ? `<p class="notes">${row["Notes"].innerHTML}</p>` : ""}
`;
      const ingredientList = row[ingredients].innerHTML
        .split(/,|\+/gi)
        .map((s) => `<p>${s.trim()}</p>`);

      row[ingredients].innerHTML = ingredientList.join("");
      return { Food: foodBlock, Ingredients: row[ingredients] };
    });
    const betterTable = makeTable(["Food", "Ingredients"], recipes);
    betterTable.className = "recipe-ext tgh-btab wikitable";
    table.replaceWith(betterTable);
  });

  const customTable = root.querySelector<HTMLElement>(
    `#Custom_Recipes .wikitable`
  );
  const customFood = parseTable(customTable).map((row) => {
    row[
      "Custom food"
    ].innerHTML = `<div class="food-name">${row["Custom food"].innerHTML}</div>`;
    return row;
  });
  const betterCustomTable = makeTable(Object.keys(customFood[0]), customFood);
  betterCustomTable.className = "food-base-ext tgh-btab wikitable";
  customTable.replaceWith(betterCustomTable);
}

export function foodScript(root: HTMLElement): void {
  // Add event to collapse subsections
  root.querySelectorAll(".bgus_nested_element").forEach((twistie) => {
    twistie.addEventListener("click", () => {
      twistie.classList.toggle("bgus_collapsed");
    });
  });

  // Init fuzzy search with elements
  const foodEntries = Array.from(
    root.querySelectorAll<HTMLElement>(
      ".drink-ext tr:not(:first-child), .food-base-ext tr:not(:first-child), .food-ext tr:not(:first-child), .recipe-ext tr:not(:first-child)"
    )
  );
  registerSearchEntries(
    foodEntries.map((element, id) => ({
      page: "Guide_to_food",
      name: element.querySelector(".food-name").textContent.trim(),
      element,
      alignment: "center",
      id,
    }))
  );
}

export default {
  processFood,
  foodScript,
};
