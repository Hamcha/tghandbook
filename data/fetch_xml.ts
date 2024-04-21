import pages from "./pages.ts";

const body = new URLSearchParams({
  pages: pages.join("\r\n"),
  curonly: "1",
  templates: "1",
  wpDownload: "1",
  wpEditToken: "+\\",
  title: "Special:Export",
});

async function getXMLDump() {
  const dump = await fetch("https://tgstation13.org/wiki/Special:Export", {
    headers: {
      accept: "text/html,application/xhtml+xml,application/xml;q=0.9",
      "content-type": "application/x-www-form-urlencoded",
      pragma: "no-cache",
    },
    referrer: "https://tgstation13.org/wiki/Special:Export",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: body.toString(),
    method: "POST",
  });

  return await dump.text();
}

const xml = await getXMLDump();
console.log(xml);
