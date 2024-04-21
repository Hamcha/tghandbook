const WIKI_BASE = "https://tgstation13.org/wiki";

export interface ParsedPage {
  title: string;
  pageid: number;
  revid: number;
  text: WrappedString;
  categories: WrappedString[];
  links: WrappedString[];
  templates: WrappedString[];
  images: string[];
  sections: Section[];
  displaytitle: string;
}

interface WrappedString {
  "*": string;
}

interface Section {
  toclevel: number;
  level: string;
  line: string;
  number: string;
  index: string;
  fromtitle: string;
  byteoffset: number;
  anchor: string;
}

/**
 * Get HTML content of a page using Mediawiki Parse APIs
 * @param name Page name
 */
export async function getPageHTML(name: string): Promise<ParsedPage> {
  const urlname = encodeURIComponent(name);
  const apiURL = `/api.php?action=parse&page=${urlname}&prop=text&format=json`;
  const result: { parse: ParsedPage } = await (
    await fetch(WIKI_BASE + apiURL)
  ).json();

  return result.parse;
}

export default { getPageHTML };
