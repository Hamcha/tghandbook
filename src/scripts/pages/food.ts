import { parseTable, makeTable } from "../utils";
import { registerSearchEntries } from "../search";

export function processFood(root: HTMLElement): void {
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

  const baseFoodTables = [
    {
      selector: "#Butchering",
      title: "Food name",
      process: "How to acquire",
    },
    {
      selector: "#Knife_\\.26_Rolling_Pin",
      title: "Food name",
      process: "How to acquire",
    },
    {
      selector: "#Processor",
      title: "Processes",
      process: "Condiments",
    },
    {
      selector: "#All-In-One-Grinder",
      title: "Blends",
      process: "How to acquire",
    },
    {
      selector: "#Microwave_Oven",
      title: "Cooked food",
      process: "How to acquire",
    },
    {
      selector: "#Junk_Food",
      title: "Dispenses",
      process: "Description",
    },
    {
      selector: "#Junk_Drinks",
      title: "Dispenses",
      process: "Description",
    },
    {
      selector: "#Hot_Drinks",
      title: "Dispenses",
      process: "Description",
    },
    {
      selector: "#Other_food",
      title: "Item",
      process: "Description",
    },
  ];
  baseFoodTables.forEach(({ selector, title, process }) => {
    const table = root.querySelector<HTMLElement>(`${selector} .wikitable`);
    const foods = parseTable(table).map((row) => {
      const foodBlock = document.createElement("td");
      foodBlock.innerHTML = `<div class="food-block">
<div class="food-pic">${row["Picture"].innerHTML}</div>
<div class="food-name">${row[title].innerHTML}</div>
</div>
`;
      const out = {};
      out[title] = foodBlock;
      out[process] = row[process];
      return out;
    });
    const betterTable = makeTable([title, process], foods);
    betterTable.className = "food-base-ext wikitable";
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
  betterCustomTable.className = "food-base-ext wikitable";
  customTable.replaceWith(betterCustomTable);

  const recipeBookTable = root.querySelector<HTMLElement>(
    `#Recipe_Books .wikitable`
  );
  const recipeBook = parseTable(recipeBookTable).map((row) => {
    const bookBlock = document.createElement("td");
    bookBlock.innerHTML = `<div class="food-pic">${row["Picture"].innerHTML}</div>
<div class="food-name">${row["Book"].innerHTML}</div>
<p class="unlocks">${row["Unlocks"].innerHTML}</p>
<p class="notes">${row["Notes"].innerHTML}</p>
`;
    return { Book: bookBlock, "Where to get": row["Where to get"] };
  });
  const betterBookTable = makeTable(["Book", "Where to get"], recipeBook);
  betterBookTable.className = "book-ext wikitable";
  recipeBookTable.replaceWith(betterBookTable);

  const foodRecipesTables = [
    "#Burgers",
    "#Breads",
    "#Sandwiches",
    "#Pizzas",
    "#Pastas",
    "#Soups_\\.26_Stews",
    "#Seafood",
    "#Meat",
    "#Misc\\._Food",
    "#Frozen",
    "#Pies",
    "#Salads",
    "#Cakes",
    "#Side_Dishes",
    "#Pastries",
    "#Sweets",
    "#Icecream_Vat",
    "#Exotic",
  ];
  foodRecipesTables.forEach((selector) => {
    const table = root.querySelector<HTMLElement>(`${selector} .wikitable`);
    const recipes = parseTable(table).map((row) => {
      const foodBlock = document.createElement("td");
      foodBlock.innerHTML = `
<div class="food-pic">${row["Picture"].innerHTML}</div>
<div class="food-name">${row["Recipe"].innerHTML}</div>
${
  "Nutritional Value" in row
    ? `<p class="nutrition">${row["Nutritional Value"].innerHTML}</p>`
    : ""
}
${"Notes" in row ? `<p class="notes">${row["Notes"].innerHTML}</p>` : ""}
`;
      const ingredients = row["Ingredients"].innerHTML
        .split(/,|\+/gi)
        .map((s) => `<p>${s.trim()}</p>`);
      row["Ingredients"].innerHTML = ingredients.join("");
      return { Drink: foodBlock, Ingredients: row["Ingredients"] };
    });
    const betterTable = makeTable(["Drink", "Ingredients"], recipes);
    betterTable.className = "recipe-ext wikitable";
    table.replaceWith(betterTable);
  });
}

export function foodScript(root: HTMLElement): void {
  // Init fuzzy search with elements
  const foodEntries = Array.from(
    root.querySelectorAll<HTMLElement>(
      ".drink-ext tr:not(:first-child), .food-base-ext tr:not(:first-child), .food-ext tr:not(:first-child)"
    )
  );
  registerSearchEntries(
    foodEntries.map((element, id) => ({
      page: "Guide_to_food_and_drinks",
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
