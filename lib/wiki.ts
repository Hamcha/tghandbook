const WIKI_BASE = "https://cors-anywhere.herokuapp.com/tgstation13.org/wiki";

/**
 * Get HTML content of a page using Mediawiki Parse APIs
 * @param name Page name
 */
export async function getPageHTML(name: string): Promise<string> {
  const urlname = encodeURIComponent(name);
  const apiURL = `/api.php?action=parse&page=${urlname}&prop=text&format=json`;
  return (await (await fetch(WIKI_BASE + apiURL)).json()).parse.text["*"];
}
