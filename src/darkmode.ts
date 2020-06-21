/* https://developer.mozilla.org/en-US/docs/Web/CSS/color_value
  $$('#colors_table tbody tr')
    .map((row) => {
      const [name, hex] = Array.from(row.children).slice(-3);
      return [name.innerText.trim().replace(/\s.+/g, ''), hex.innerText.trim()];
    }).sort((a, b) => [a[0], b[0]].sort()[0] === a[0] ? -1 : 1)
    .map(([name, hex]) => `${name} : '${hex}',`)
    .join('\n')
*/
const namedColors = {
  aliceblue: "#f0f8ff",
  antiquewhite: "#faebd7",
  aqua: "#00ffff",
  aquamarine: "#7fffd4",
  azure: "#f0ffff",
  beige: "#f5f5dc",
  bisque: "#ffe4c4",
  black: "#000000",
  blanchedalmond: "#ffebcd",
  blue: "#0000ff",
  blueviolet: "#8a2be2",
  brown: "#a52a2a",
  burlywood: "#deb887",
  cadetblue: "#5f9ea0",
  chartreuse: "#7fff00",
  chocolate: "#d2691e",
  coral: "#ff7f50",
  cornflowerblue: "#6495ed",
  cornsilk: "#fff8dc",
  crimson: "#dc143c",
  cyan: "#00ffff",
  darkblue: "#00008b",
  darkcyan: "#008b8b",
  darkgoldenrod: "#b8860b",
  darkgray: "#a9a9a9",
  darkgreen: "#006400",
  darkgrey: "#a9a9a9",
  darkkhaki: "#bdb76b",
  darkmagenta: "#8b008b",
  darkolivegreen: "#556b2f",
  darkorange: "#ff8c00",
  darkorchid: "#9932cc",
  darkred: "#8b0000",
  darksalmon: "#e9967a",
  darkseagreen: "#8fbc8f",
  darkslateblue: "#483d8b",
  darkslategray: "#2f4f4f",
  darkslategrey: "#2f4f4f",
  darkturquoise: "#00ced1",
  darkviolet: "#9400d3",
  deeppink: "#ff1493",
  deepskyblue: "#00bfff",
  dimgray: "#696969",
  dimgrey: "#696969",
  dodgerblue: "#1e90ff",
  firebrick: "#b22222",
  floralwhite: "#fffaf0",
  forestgreen: "#228b22",
  fuchsia: "#ff00ff",
  gainsboro: "#dcdcdc",
  ghostwhite: "#f8f8ff",
  gold: "#ffd700",
  goldenrod: "#daa520",
  gray: "#808080",
  green: "#008000",
  greenyellow: "#adff2f",
  grey: "#808080",
  honeydew: "#f0fff0",
  hotpink: "#ff69b4",
  indianred: "#cd5c5c",
  indigo: "#4b0082",
  ivory: "#fffff0",
  khaki: "#f0e68c",
  lavender: "#e6e6fa",
  lavenderblush: "#fff0f5",
  lawngreen: "#7cfc00",
  lemonchiffon: "#fffacd",
  lightblue: "#add8e6",
  lightcoral: "#f08080",
  lightcyan: "#e0ffff",
  lightgoldenrodyellow: "#fafad2",
  lightgray: "#d3d3d3",
  lightgreen: "#90ee90",
  lightgrey: "#d3d3d3",
  lightpink: "#ffb6c1",
  lightsalmon: "#ffa07a",
  lightseagreen: "#20b2aa",
  lightskyblue: "#87cefa",
  lightslategray: "#778899",
  lightslategrey: "#778899",
  lightsteelblue: "#b0c4de",
  lightyellow: "#ffffe0",
  lime: "#00ff00",
  limegreen: "#32cd32",
  linen: "#faf0e6",
  magenta: "#ff00ff",
  maroon: "#800000",
  mediumaquamarine: "#66cdaa",
  mediumblue: "#0000cd",
  mediumorchid: "#ba55d3",
  mediumpurple: "#9370db",
  mediumseagreen: "#3cb371",
  mediumslateblue: "#7b68ee",
  mediumspringgreen: "#00fa9a",
  mediumturquoise: "#48d1cc",
  mediumvioletred: "#c71585",
  midnightblue: "#191970",
  mintcream: "#f5fffa",
  mistyrose: "#ffe4e1",
  moccasin: "#ffe4b5",
  navajowhite: "#ffdead",
  navy: "#000080",
  oldlace: "#fdf5e6",
  olive: "#808000",
  olivedrab: "#6b8e23",
  orange: "#ffa500",
  orangered: "#ff4500",
  orchid: "#da70d6",
  palegoldenrod: "#eee8aa",
  palegreen: "#98fb98",
  paleturquoise: "#afeeee",
  palevioletred: "#db7093",
  papayawhip: "#ffefd5",
  peachpuff: "#ffdab9",
  peru: "#cd853f",
  pink: "#ffc0cb",
  plum: "#dda0dd",
  powderblue: "#b0e0e6",
  purple: "#800080",
  rebeccapurple: "#663399",
  red: "#ff0000",
  rosybrown: "#bc8f8f",
  royalblue: "#4169e1",
  saddlebrown: "#8b4513",
  salmon: "#fa8072",
  sandybrown: "#f4a460",
  seagreen: "#2e8b57",
  seashell: "#fff5ee",
  sienna: "#a0522d",
  silver: "#c0c0c0",
  skyblue: "#87ceeb",
  slateblue: "#6a5acd",
  slategray: "#708090",
  slategrey: "#708090",
  snow: "#fffafa",
  springgreen: "#00ff7f",
  steelblue: "#4682b4",
  tan: "#d2b48c",
  teal: "#008080",
  thistle: "#d8bfd8",
  tomato: "#ff6347",
  turquoise: "#40e0d0",
  violet: "#ee82ee",
  wheat: "#f5deb3",
  white: "#ffffff",
  whitesmoke: "#f5f5f5",
  yellow: "#ffff00",
  yellowgreen: "#9acd32",
};

interface ColorRGB {
  r: number;
  g: number;
  b: number;
}

interface ColorHSV {
  h: number;
  s: number;
  v: number;
}

export enum ColorFmt {
  RGB, // rgb(R,G,B)
  HEX, // #RRGGBB
}

function hsvToRgb({ h, s, v }: ColorHSV): ColorRGB {
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0:
      return { r: v, g: t, b: p };
    case 1:
      return { r: q, g: v, b: p };
    case 2:
      return { r: p, g: v, b: t };
    case 3:
      return { r: p, g: q, b: v };
    case 4:
      return { r: t, g: p, b: v };
    case 5:
      return { r: v, g: p, b: q };
    default:
      throw new Error("unreacheable");
  }
}

function rgbToHsv({ r, g, b }: ColorRGB): ColorHSV {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const v = max;

  const d = max - min;
  const s = max === 0 ? 0 : d / max;

  let h;
  if (max === min) {
    h = 0; // achromatic
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        throw new Error("unreacheable");
    }
    h /= 6;
  }

  return { h, s, v };
}

// Hacky way to get RGB values FOR SURE!
function nameToRGB(name: string): ColorRGB {
  if (namedColors[name]) {
    return parseColor(namedColors[name]);
  }

  // Create fake div
  const fakeDiv = document.createElement("div");
  fakeDiv.style.color = name;
  document.body.appendChild(fakeDiv);

  // Get color of div
  const cs = window.getComputedStyle(fakeDiv);
  const pv = cs.getPropertyValue("color");

  // Remove div after obtaining desired color value
  document.body.removeChild(fakeDiv);

  return parseColor(pv);
}

// If you also wonder "What the fuck", go here:
// https://stackoverflow.com/questions/11068240/what-is-the-most-efficient-way-to-parse-a-css-color-in-javascript
function parseColor(input: string): ColorRGB {
  // Hex format
  if (input[0] === "#") {
    const collen = (input.length - 1) / 3;
    const fact = [17, 1, 0.062272][collen - 1];
    return {
      r: Math.round(parseInt(input.substr(1, collen), 16) * fact) / 256,
      g:
        Math.round(parseInt(input.substr(1 + collen, collen), 16) * fact) / 256,
      b:
        Math.round(parseInt(input.substr(1 + 2 * collen, collen), 16) * fact) /
        256,
    };
  }
  if (input.startsWith("rgb")) {
    // RGB() format
    const vals = input
      .split("(")[1]
      .split(")")[0]
      .split(",")
      .map((i) => parseInt(i, 10))
      .map(Math.round);
    return { r: vals[0] / 256, g: vals[1] / 256, b: vals[2] / 256 };
  }
  // Fuck, well.. normalize it and put it into an element and get back to me
  return nameToRGB(input);
}

function serializeColor(col: ColorRGB, format: ColorFmt): string {
  const r = Math.round(col.r * 255);
  const g = Math.round(col.g * 255);
  const b = Math.round(col.b * 255);
  switch (format) {
    case ColorFmt.RGB:
      return `rgb(${r}, ${g}, ${b})`;
    case ColorFmt.HEX: {
      const rhex = `00${r.toString(16)}`.slice(-2);
      const ghex = `00${g.toString(16)}`.slice(-2);
      const bhex = `00${b.toString(16)}`.slice(-2);
      return `#${rhex}${ghex}${bhex}`;
    }
    default:
      return "#000";
  }
}

export function darken(color: string, format: ColorFmt): string {
  const col = parseColor(color);
  const hsl = rgbToHsv(col);
  if (hsl.s < 0.15) {
    hsl.h = 0.6;
    hsl.s = 0.5;
    hsl.v = Math.max(0.2, 1 - hsl.v);
  } else if (hsl.v > 0.5) {
    hsl.v = 0.4;
    if (hsl.s > 0.2) {
      hsl.s = Math.min(1, hsl.s + 0.2);
    }
  }
  const out = hsvToRgb(hsl);
  return serializeColor(out, format);
}

export function lighten(color: string, format: ColorFmt): string {
  const col = parseColor(color);
  const hsl = rgbToHsv(col);
  if (hsl.v < 0.5) {
    hsl.v = 0.8;
  }
  if (hsl.s > 0.7) {
    hsl.s = Math.min(1, hsl.s - 0.3);
    hsl.v = 1;
  }
  // Blue is shit to read, make it cyan
  if (Math.abs(hsl.h - 0.666) < 0.1) {
    hsl.h -= 0.13;
    hsl.v = Math.min(1, hsl.v + 0.1);
  }
  const out = hsvToRgb(hsl);
  return serializeColor(out, format);
}
