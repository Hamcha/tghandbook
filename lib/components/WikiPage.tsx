import { getPageHTML } from "../wiki";
import { darken, ColorFmt, lighten } from "../darkmode";
import * as React from "react";
import { useState, useEffect, useRef } from "react";
import userscript from "../userscript";
import speen from "~/assets/images/speen.svg";

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
    if (td.style.backgroundColor != "") {
      td.style.backgroundColor = darken(td.style.backgroundColor, ColorFmt.RGB);
    }
    if (td.style.background != "") {
      td.style.backgroundColor = darken(td.style.background, ColorFmt.RGB);
    }
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
    td.setAttribute("width", "100%");
  });
  node.querySelectorAll("table[style]").forEach((td: HTMLTableElement) => {
    if (td.style.width != "") {
      td.style.width = "100%";
    }
  });

  // Group headers and content so stickies don't overlap
  node.querySelectorAll("h3,h2").forEach((h3) => {
    const parent = h3.parentNode;
    const div = document.createElement("div");
    parent.insertBefore(div, h3);
    while (h3.nextSibling && !h3.nextSibling.nodeName.startsWith("H")) {
      const sibling = h3.nextSibling;
      parent.removeChild(sibling);
      div.appendChild(sibling);
    }
    h3.parentNode.removeChild(h3);
    div.insertBefore(h3, div.firstChild);
    div.className = "mw-headline-cont";
  });

  node.querySelectorAll(".mw-headline").forEach((span: HTMLElement) => {
    // Find nearest container
    let parent = span.parentElement;
    while (parent !== null) {
      if (parent.classList.contains("mw-headline-cont")) {
        parent.id = span.id;
        span.id += "-span";
        parent.dataset.name = span.innerText;
      }
      parent = parent.parentElement;
    }
  });

  return node.innerHTML;
}

export default function WikiPage({ page, visible }) {
  const [data, setData] = useState({ loaded: false, html: "" });
  const containerRef = useRef(null);

  // Fetch page
  useEffect(() => {
    console.log("fetching");
    (async () => {
      let html = await getPageHTML(page);
      html = fixup(html);
      setData({ loaded: true, html });
    })();
  }, []);

  // Page fetched, instance userscript
  useEffect(() => {
    if (data.loaded) {
      userscript(containerRef.current, page);
      console.log("userscript applied");
    }
  }, [data]);

  if (!data.loaded) {
    return (
      <div className="page waiting">
        <p
          style={{
            display: visible ? "block" : "none",
          }}
        >
          You start skimming through the manual...
        </p>
        <div className="speen">
          <img src={speen} />
        </div>
      </div>
    );
  } else {
    return (
      <div
        ref={containerRef}
        className="page"
        style={{
          visibility: visible ? "" : "hidden",
        }}
        dangerouslySetInnerHTML={{ __html: data.html }}
      ></div>
    );
  }
}
