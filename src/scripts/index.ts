import { chemistryScript, processChemistry } from "./pages/chemistry";
import { processVirology, virologyScript } from "./pages/virology";
import { processFood, foodScript } from "./pages/food";
import { processDrinks, drinkScript } from "./pages/drinks";
import { genericScript } from "./pages/generic";
import { processGlobal } from "./pages/global";
import { welcomeScript } from "./pages/welcome";

// This is used for cache busting when userscript changes significantly.
// Only change it when you made changes to the processHTML part!
export const PAGE_VERSIONS = {
  Infections: "fcebeda2fddb46d924f4538cd9c0daeb55aa4c9b",
  Guide_to_food_and_drinks: "131e010df66ed689d31df53c3ca17ad16635a827",
  Guide_to_chemistry: "5074d6180fc8b283bac00b99c6aa2325b797da6b",
  $DEFAULT: "5074d6180fc8b283bac00b99c6aa2325b797da6b",
};

const MAX_WIDTH = 440;

export function processHTML(root: HTMLElement, docname: string): void {
  try {
    processGlobal(root, docname);
  } catch (e) {
    console.error(`Error processing page: ${docname}`);
  }

  try {
    switch (docname) {
      case "Guide_to_chemistry":
        processChemistry(root);
        break;
      case "Infections":
        processVirology(root);
        break;
      case "Guide_to_food":
        processFood(root);
        break;
      case "Guide_to_drinks":
        processDrinks(root);
        break;
      default:
    }
  } catch (e) {
    console.error(`Error processing page: ${docname} (specific enhancements)`);
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function postProcessHTML(root: HTMLElement, docname: string): void {
  // This should be noop unless we're testing changes before committing them to processHTML
  document.querySelectorAll("img[width]").forEach((img) => {
    const width = img.getAttribute("width");

    // Don't care if they are not absolutely sized
    if (width.includes("%")) {
      return;
    }

    const widthI = parseInt(width, 10);
    if (widthI > MAX_WIDTH) {
      img.setAttribute("width", "100%");
      img.removeAttribute("height"); // Remove any height so we don't have to deal with the crazy math
    }
  });

  switch (docname) {
    default:
  }
}

export function bindFunctions(root: HTMLElement, docname: string): void {
  switch (docname) {
    case "Guide_to_chemistry":
      genericScript(root, docname);
      chemistryScript(root);
      break;
    case "Infections":
      genericScript(root, docname);
      virologyScript(root);
      break;
    case "$Welcome":
      welcomeScript(root);
      break;
    case "Guide_to_food":
      genericScript(root, docname);
      foodScript(root);
      break;
    case "Guide_to_drinks":
      genericScript(root, docname);
      drinkScript(root);
      break;
    default:
      genericScript(root, docname);
      break;
  }
}

export default {
  PAGE_VERSIONS,
  postProcessHTML,
  processHTML,
  bindFunctions,
};
