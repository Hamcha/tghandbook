import { makeTable } from "../utils";
import { registerSearchEntries } from "../search";
import { registerProcess, registerScript } from "../register";
import { makeDOM } from "../../utils";

const page = "Guide_to_Restaurant";

interface TouristOrder {
  icon: string;
  name: string;
}

interface TouristEntry {
  name: string;
  icons: HTMLImageElement[];
  foods: TouristOrder[];
  drinks: TouristOrder[];
}

function orderToItem(order: TouristOrder) {
  const item = makeDOM("div", { className: "tourist-order" });
  item.innerHTML = `${order.icon} ${order.name}`;
  return item;
}

registerProcess(page, (root) => {
  // Transform tourist table
  // The usual tricks don't work here, this table is extra funky
  const touristTable = root.querySelector("#Tourists_and_orders .wikitable")!;

  const tourists: TouristEntry[] = [];
  let currentTourist: TouristEntry;
  let noFood = false;
  touristTable.querySelectorAll("tr").forEach((row) => {
    const cells = Array.from(row.querySelectorAll("td"));
    // Ignore top row
    if (cells.length < 1) {
      return;
    }
    // Check if first cell is a tourist
    if (cells[0].rowSpan > 1 && cells[0].colSpan === 1) {
      if (currentTourist != null) {
        tourists.push(currentTourist);
      }
      currentTourist = {
        name: cells[0].textContent?.trim() || "",
        icons: Array.from(cells[0].querySelectorAll<HTMLImageElement>("img")),
        foods: [],
        drinks: [],
      };
      noFood = false;
      // Remove from list
      cells.splice(0, 1);
    }
    // Special case, foods are over but drinks aren't
    if (cells[0].rowSpan > 1) {
      noFood = true;
      cells.splice(0, 1);
    }
    // Next 2 rows are food
    if (!noFood && cells.length > 1) {
      currentTourist.foods.push({
        icon: cells[0].innerHTML,
        name: cells[1].innerHTML,
      });
      // Remove from list
      cells.splice(0, 2);
    }
    // Next 2 rows (where existing) are drinks
    if (cells.length > 1) {
      currentTourist.drinks.push({
        icon: cells[0].innerHTML,
        name: cells[1].innerHTML,
      });
    }
  });
  if (currentTourist) {
    tourists.push(currentTourist);
  }

  const betterTouristTable = makeTable(
    ["Customer", "Food", "Drinks"],
    tourists.map((tourist) => ({
      Customer: makeDOM("td", { className: "btab-name" }, ...tourist.icons, [
        "span",
        { className: "tourist-name" },
        tourist.name,
      ]),
      Food: makeDOM("td", ...tourist.foods.map(orderToItem)),
      Drinks: makeDOM("td", ...tourist.drinks.map(orderToItem)),
    })),
  );
  betterTouristTable.className = "tourist-ext tgh-btab wikitable";

  touristTable.replaceWith(betterTouristTable);
});

registerScript(page, (root) => {
  const tourists = Array.from(
    root.querySelectorAll<HTMLElement>(
      ".tourist-ext > tbody > tr:not(:first-child)",
    ),
  );
  registerSearchEntries(
    tourists.map((element, id) => ({
      page,
      name: element.querySelector(".tourist-name")?.textContent?.trim() || "",
      element,
      alignment: "center",
      id,
    })),
  );
});
