import { chemistryScript, processChemistry } from "./pages/chemistry";
import { virologyScript } from "./pages/virology";
import { genericScript } from "./pages/generic";
import { processGlobal } from "./pages/global";

// This is used for cache busting when userscript changes significantly.
// Only change it when you made changes to the processHTML part!
export const CURRENT_VERSION = "bb7abd544a19369d4b6b7e3dde3eb3cc34c023d4";

const MAX_WIDTH = 440;

export function processHTML(root: HTMLElement, docname: string): void {
  processGlobal(root, docname);

  switch (docname) {
    case "Guide_to_chemistry":
      processChemistry(root);
      break;
    default:
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
    case "Infections":
      virologyScript(root);
      break;
    default:
  }
}

export function bindFunctions(root: HTMLElement, docname: string): void {
  switch (docname) {
    case "Guide_to_chemistry":
      chemistryScript(root);
      break;
    default:
      genericScript(root, docname);
      break;
  }
}

export default {
  CURRENT_VERSION,
  postProcessHTML,
  processHTML,
  bindFunctions,
};
