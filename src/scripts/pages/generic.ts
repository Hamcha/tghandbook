import { GLOBAL, registerScript } from "../register";
import { registerSearchEntries } from "../search";

registerScript(GLOBAL, (root, docname) => {
  const el = Array.from(
    root.querySelectorAll<HTMLElement>(".mw-headline-cont[id][data-name]")
  );

  // Init fuzzy search with headlines
  registerSearchEntries(
    el.map((element: HTMLDivElement, id) => ({
      id,
      page: docname,
      name: element.dataset.name.trim(),
      element,
      alignment: "start",
    }))
  );
});
