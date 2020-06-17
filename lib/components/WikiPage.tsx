import { getPageHTML } from "../wiki";
import { darken, ColorFmt, lighten } from "../darkmode";
import * as React from "react";
import { useState, useEffect, useRef } from "react";
import userscript from "../userscript";
import speen from "~/assets/images/speen.svg";

export default function WikiPage({ page, visible }) {
  const [data, setData] = useState({
    loaded: false,
    processed: false,
    html: "",
  });
  const containerRef = useRef(null);

  // Fetch page
  useEffect(() => {
    console.log(page + ": fetching");
    (async () => {
      let html = await getPageHTML(page);
      // Convert relative links to absolute
      html = html.replace(/"\/wiki/gi, '"//tgstation13.org/wiki');
      setData({ loaded: true, processed: false, html });
    })();
  }, []);

  // Process page
  useEffect(() => {
    console.log(page + ": processing");
    if (data.loaded == true && data.processed == false) {
      userscript(containerRef.current, page);
      console.log(page + ": userscript applied");
    }
  }, [data]);

  if (!data.loaded) {
    return (
      <div
        className="page waiting"
        style={{
          visibility: visible ? "" : "hidden",
        }}
      >
        <div className="speen">
          <img src={speen} />
          <p>You start skimming through the manual...</p>
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
