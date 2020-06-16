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
  var r, g, b;

  var i = Math.floor(h * 6);
  var f = h * 6 - i;
  var p = v * (1 - s);
  var q = v * (1 - f * s);
  var t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0:
      (r = v), (g = t), (b = p);
      break;
    case 1:
      (r = q), (g = v), (b = p);
      break;
    case 2:
      (r = p), (g = v), (b = t);
      break;
    case 3:
      (r = p), (g = q), (b = v);
      break;
    case 4:
      (r = t), (g = p), (b = v);
      break;
    case 5:
      (r = v), (g = p), (b = q);
      break;
  }
  return { r, g, b };
}

function rgbToHsv({ r, g, b }: ColorRGB): ColorHSV {
  var max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  var h,
    s,
    v = max;

  var d = max - min;
  s = max == 0 ? 0 : d / max;

  if (max == min) {
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
    }
    h /= 6;
  }

  return { h, s, v };
}

// Hacky way to get RGB values FOR SURE!
function nameToRGB(name: string): ColorRGB {
  // Create fake div
  let fakeDiv = document.createElement("div");
  fakeDiv.style.color = name;
  document.body.appendChild(fakeDiv);

  // Get color of div
  let cs = window.getComputedStyle(fakeDiv),
    pv = cs.getPropertyValue("color");

  // Remove div after obtaining desired color value
  document.body.removeChild(fakeDiv);

  return parseColor(pv);
}

// If you also wonder "What the fuck", go here:
// https://stackoverflow.com/questions/11068240/what-is-the-most-efficient-way-to-parse-a-css-color-in-javascript
function parseColor(input: string): ColorRGB {
  // Hex format
  if (input.substr(0, 1) == "#") {
    var collen = (input.length - 1) / 3;
    var fact = [17, 1, 0.062272][collen - 1];
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
      const rhex = ("00" + r.toString(16)).slice(-2);
      const ghex = ("00" + g.toString(16)).slice(-2);
      const bhex = ("00" + b.toString(16)).slice(-2);
      return "#" + rhex + ghex + bhex;
    }
  }
}

export function darken(color: string, format: ColorFmt): string {
  const col = parseColor(color);
  const hsl = rgbToHsv(col);
  if (hsl.s < 0.15) {
    hsl.h = 0.1;
    hsl.s = 0.5;
    hsl.v = Math.max(0.2, 1 - hsl.v);
  } else {
    if (hsl.v > 0.5) {
      hsl.v = 0.4;
      if (hsl.s > 0.2) {
        hsl.s = Math.min(1, hsl.s + 0.2);
      }
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
