import pages from "./pages.ts";
import { getPageHTML } from "./wiki.ts";

await Promise.all(
  pages.map(async (name) => {
    const json = await getPageHTML(name);
    await Deno.writeFile(
      `./pages/${name}.json`,
      new TextEncoder().encode(JSON.stringify(json))
    );
    console.log(`Downloaded ${name}`);
  })
);
