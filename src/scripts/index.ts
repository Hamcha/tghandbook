// Global script
import "./pages/global";

// Page-specific processing/scripts
import "./pages/chemistry";
import "./pages/virology";
import "./pages/food";
import "./pages/drinks";
import "./pages/ghettochem";
import "./pages/mafia";
import "./pages/critters";

// Meta pages scripts
import "./pages/welcome";
import "./pages/changelog";

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

export default {
  PAGE_VERSIONS,
  postProcessHTML,
};
