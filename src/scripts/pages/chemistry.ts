import { registerSearchEntries } from "../search";

export default function chemistryScript(root: HTMLElement): void {
  // Add event to autofill child checkboxes
  root
    .querySelectorAll(".bgus_part_tooltip > .bgus_checkbox")
    .forEach((box: HTMLInputElement) => {
      const tooltip = box.parentElement.nextElementSibling;
      box.addEventListener("click", () => {
        tooltip
          .querySelectorAll(".bgus_checkbox")
          .forEach((el: HTMLInputElement) => {
            el.checked = box.checked;
          });
      });
    });

  // Add event to collapse subsections
  root.querySelectorAll(".bgus_nested_element").forEach((twistie) => {
    twistie.addEventListener("click", () => {
      twistie.classList.toggle("bgus_collapsed");
    });
  });

  const setPartSize = (labels, ml) => {
    labels.forEach((el) => {
      const part = el.parentElement.dataset.amount;
      const total = el.parentElement.parentElement.dataset.parts;
      const amt = Math.ceil(ml * (part / total));
      el.innerHTML = `${amt} ml`;
      // Lookup tooltips
      let next = el.parentElement.nextElementSibling;
      while (next) {
        if (next.classList.contains("tooltip")) {
          const sublabels = [];
          next.querySelector(".tooltiptext").childNodes.forEach((ch) => {
            if (ch.classList && ch.classList.contains("bgus_part")) {
              sublabels.push(ch.querySelector(".bgus_part_label"));
            }
          });
          setPartSize(sublabels, amt);
        }
        if (next.classList.contains("bgus_part")) {
          // Done searching
          break;
        }
        next = next.nextElementSibling;
      }
    });
  };

  // Init fuzzy search with elements
  const el = Array.from(
    root.querySelectorAll<HTMLElement>(
      "table.wikitable > tbody > tr:not(:first-child) > th"
    )
  );
  registerSearchEntries(
    el.map((element, id) => ({
      page: "Guide_to_chemistry",
      name: element
        .querySelector(".reagent-header")
        .textContent.trim()
        .replace("▮", ""),
      element,
      alignment: "center",
      id,
    }))
  );

  document.body.addEventListener("keydown", (ev) => {
    if (ev.shiftKey) {
      switch (ev.keyCode) {
        // SHIFT+C = Toggle checkboxes
        case 67: {
          root.classList.toggle("bgus_cbox");
          root
            .querySelectorAll(".bgus_checkbox:checked")
            .forEach((sel: HTMLInputElement) => {
              sel.checked = false;
            });
          break;
        }

        // SHIFT+B = Set whole size (beaker?) for parts/units
        case 66: {
          const size = parseInt(
            prompt("Write target ml (0 to reset)", "90"),
            10
          );
          if (Number.isNaN(size) || size <= 0) {
            // Reset to parts/unit
            root
              .querySelectorAll(".bgus_part_label")
              .forEach((sel: HTMLElement) => {
                sel.innerHTML = sel.dataset.src;
              });
            return;
          }
          setPartSize(
            root.querySelectorAll("td > .bgus_part > .bgus_part_label"),
            +size
          );
          break;
        }

        default:
        // Do nothing
      }
    }
  });
}
