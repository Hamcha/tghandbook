import { registerSearchEntries } from "../search";

export function genericScript(root: HTMLElement, docname: string): void {
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
}

export default { genericScript };
