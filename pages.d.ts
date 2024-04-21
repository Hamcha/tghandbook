interface ParsedPage {
  title: string;
  pageid: number;
  revid: number;
  text: WrappedString;
  categories: WrappedString[];
  links: WrappedString[];
  templates: WrappedString[];
  images: string[];
  sections: WikiSection[];
  displaytitle: string;
}

interface WrappedString {
  "*": string;
}

interface WikiSection {
  toclevel: number;
  level: string;
  line: string;
  number: string;
  index: string;
  fromtitle: string;
  byteoffset: number;
  anchor: string;
}

declare module "@pages/*.json" {
  const src: ParsedPage;
  export default src;
}
