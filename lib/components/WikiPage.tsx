import { getPageHTML } from "../wiki";
import { darken, ColorFmt, lighten } from "../darkmode";
import * as React from "react";
import { useState, useEffect } from "react";

function fixup(html: string): string {
  // Convert relative links to absolute
  html = html.replace(/"\/wiki/gi, '"//tgstation13.org/wiki');

  // Parse into node so we can do DOM majicks
  const node = document.createElement("div");
  node.innerHTML = html;
  node.querySelectorAll(".mw-editsection").forEach((editLink) => {
    editLink.parentElement.removeChild(editLink);
  });

  // Darken bgcolor
  node.querySelectorAll("*[bgcolor]").forEach((td) => {
    let bgcolor = td.getAttribute("bgcolor");
    // Shitty way to detect if it's hex or not
    // Basically, none of the css colors long 6 letters only use hex letters
    // THANK FUCKING GOD
    if (bgcolor.length === 6 && parseInt(bgcolor, 16) !== NaN) {
      bgcolor = "#" + bgcolor;
    }
    td.setAttribute("bgcolor", darken(bgcolor, ColorFmt.HEX).slice(1));
  });
  node.querySelectorAll("*[style]").forEach((td: HTMLElement) => {
    const inlineCSS = td.getAttribute("style");
    let bgcolor = td.style.background;
    if (inlineCSS.includes("background-color")) {
      bgcolor = td.style.backgroundColor;
    }
    td.setAttribute(
      "style",
      inlineCSS + ";background-color:" + darken(bgcolor, ColorFmt.RGB)
    );
  });

  // Lighten fgcolors
  node.querySelectorAll("*[color]").forEach((td) => {
    let color = td.getAttribute("color");
    if (color.length === 6 && !isNaN(parseInt(color, 16))) {
      color = "#" + color;
    }
    td.setAttribute("color", lighten(color, ColorFmt.HEX).slice(1));
  });

  // Remove fixed widths
  node.querySelectorAll("table[width]").forEach((td) => {
    const width = td.getAttribute("width");
    if (width.includes("%")) {
      // Leave it alone
      return;
    }
    td.setAttribute("width", "100%");
  });

  return node.innerHTML;
}

export default function WikiPage({ page }) {
  const [data, setData] = useState({ loaded: false, html: "" });
  useEffect(() => {
    (async () => {
      let html = await getPageHTML(page);
      html = fixup(html);
      setData({ loaded: true, html });
    })();
  }, []);
  if (!data.loaded) {
    return <p>You start skimming through the manual...</p>;
  } else {
    return (
      <div
        className="page"
        dangerouslySetInnerHTML={{ __html: data.html }}
      ></div>
    );
  }
}
