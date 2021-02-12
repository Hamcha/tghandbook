import { findParent } from "../utils";
import { darken, ColorFmt, lighten } from "../darkmode";

function isHeader(nodeName: string) {
  return nodeName === "H1" || nodeName === "H2" || nodeName === "H3";
}

export function processGlobal(root: HTMLElement, docname: string): void {
  // Add header
  const header = document.createElement("h1");
  header.className = "pageheader";
  header.appendChild(document.createTextNode(docname.replace(/_/g, " ")));
  root.insertBefore(header, root.firstChild);

  // Lazy load all images
  root
    .querySelectorAll<HTMLImageElement>("img")
    .forEach((elem) => elem.setAttribute("loading", "lazy"));

  // Remove edit links
  root.querySelectorAll(".mw-editsection").forEach((editLink) => {
    editLink.parentElement.removeChild(editLink);
  });

  // Darken bgcolor
  root.querySelectorAll("*[bgcolor]").forEach((td) => {
    let bgcolor = td.getAttribute("bgcolor");
    // Shitty way to detect if it's hex or not
    // Basically, none of the css colors long 6 letters only use hex letters
    // THANK FUCKING GOD
    if (bgcolor.length === 6 && !Number.isNaN(parseInt(bgcolor, 16))) {
      bgcolor = `#${bgcolor}`;
    }
    td.setAttribute("bgcolor", darken(bgcolor, ColorFmt.HEX).slice(1));
  });
  root.querySelectorAll<HTMLElement>("*[style]").forEach((td) => {
    if (td.style.backgroundColor !== "") {
      td.style.backgroundColor = darken(td.style.backgroundColor, ColorFmt.RGB);
    }
    if (td.style.background !== "") {
      td.style.backgroundColor = darken(td.style.background, ColorFmt.RGB);
    }
  });

  // Lighten fgcolors
  root.querySelectorAll("*[color]").forEach((td) => {
    let color = td.getAttribute("color");
    if (color.length === 6 && !Number.isNaN(parseInt(color, 16))) {
      color = `#${color}`;
    }
    td.setAttribute("color", lighten(color, ColorFmt.HEX).slice(1));
  });

  // Remove fixed widths
  root.querySelectorAll("table[width]").forEach((td) => {
    td.setAttribute("width", "100%");
  });
  root.querySelectorAll("table[style]").forEach((td: HTMLTableElement) => {
    if (td.style.width !== "") {
      td.style.width = "100%";
    }
  });

  // Fixup spacing on top quotes
  root
    .querySelectorAll<HTMLImageElement>("table .floatright > a > img")
    .forEach((img) => {
      const row = findParent(img, (el) => el instanceof HTMLTableRowElement);
      const td = document.createElement("td");
      row.appendChild(td);
    });

  // Fuck #toctitle
  const toc = root.querySelector("#toc");
  if (toc) {
    const tocHeader = toc.querySelector("h2");
    toc.parentNode.insertBefore(tocHeader, toc);
    toc.removeChild(toc.querySelector("#toctitle"));
  }

  // Group headers and content so stickies don't overlap
  root.querySelectorAll("h1,h2,h3").forEach((h3) => {
    const parent = h3.parentNode;
    const div = document.createElement("div");
    parent.insertBefore(div, h3);
    while (h3.nextSibling && !isHeader(h3.nextSibling.nodeName)) {
      const sibling = h3.nextSibling;
      parent.removeChild(sibling);
      div.appendChild(sibling);
    }
    h3.parentNode.removeChild(h3);
    div.insertBefore(h3, div.firstChild);
    div.className = "mw-headline-cont";
  });

  // Move id from header to container, if one is found
  root.querySelectorAll<HTMLElement>(".mw-headline").forEach((span) => {
    // Find nearest container
    const container = findParent(span, (el) =>
      el.classList.contains("mw-headline-cont")
    );
    if (container) {
      container.id = span.id;
      span.id += "-span";
      container.dataset.name = span.textContent;
    }
  });
}

export default { processGlobal };
