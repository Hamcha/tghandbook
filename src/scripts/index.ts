import { chemistryScript, processChemistry } from "./pages/chemistry";
import { processVirology, virologyScript } from "./pages/virology";
import { processFood, foodScript } from "./pages/food";
import { processDrinks, drinkScript } from "./pages/drinks";
import { genericScript } from "./pages/generic";
import { processGlobal } from "./pages/global";
import { welcomeScript } from "./pages/welcome";
import { ghettochemScript, processGhettochem } from "./pages/ghettochem";
import { mafiaScript, processMafia } from "./pages/mafia";
import { crittersScript, processCritters } from "./pages/critters";

// This is used for cache busting when userscript changes significantly.
// Only change it when making changes to the processHTML scripts!
export const PAGE_VERSIONS = {
  Infections: "f7599d8e6598d2eca4aa9869262d0681983a95ec",
  Guide_to_food: "f7599d8e6598d2eca4aa9869262d0681983a95ec",
  Guide_to_drinks: "f7599d8e6598d2eca4aa9869262d0681983a95ec",
  Guide_to_chemistry: "f7599d8e6598d2eca4aa9869262d0681983a95ec",
  Guide_to_Ghetto_Chemistry: "f7599d8e6598d2eca4aa9869262d0681983a95ec",
  Mafia: "87d3bd9890395d4c01e435e895ac05aac3515047",
  Critters: "87d3bd9890395d4c01e435e895ac05aac3515047",
  $DEFAULT: "f7599d8e6598d2eca4aa9869262d0681983a95ec",
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
      case "Guide_to_Ghetto_Chemistry":
        processGhettochem(root);
        break;
      case "Mafia":
        processMafia(root);
        break;
      case "Critters":
        processCritters(root);
        break;
      default:
    }
  } catch (e) {
    console.error(`Error processing page: ${docname} (specific enhancements)`);
    console.error(e);
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
    case "Guide_to_Ghetto_Chemistry":
      genericScript(root, docname);
      ghettochemScript(root);
      break;
    case "Mafia":
      genericScript(root, docname);
      mafiaScript(root);
      break;
    case "Critters":
      genericScript(root, docname);
      crittersScript(root);
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
