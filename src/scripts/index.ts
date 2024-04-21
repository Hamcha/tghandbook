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
import "./pages/tourist";

// Meta pages scripts
import "./pages/welcome";
import "./pages/changelog";

const MAX_WIDTH = 440;

export function postProcessHTML(_root: HTMLElement, docname: string): void {
  // This should be noop unless we're testing changes before committing them to processHTML
  document.querySelectorAll("img[width]").forEach((img) => {
    const width = img.getAttribute("width")!;

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
  postProcessHTML,
};
