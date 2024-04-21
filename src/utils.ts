export function nextAnimationFrame(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}

export function stripStart(str: string, start: string): string {
  if (str.startsWith(start)) {
    return str.slice(start.length);
  }
  return str;
}

// https://stackoverflow.com/a/2947012
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DOMParam = string | Record<string, any> | [string, ...DOMParam[]];

export function makeDOM(...desc: [string, ...DOMParam[]]): HTMLElement {
  const name = desc[0];
  const attributes = desc[1];

  const el = document.createElement(name);

  let start = 1;
  if (
    typeof attributes === "object" &&
    attributes !== null &&
    !Array.isArray(attributes)
  ) {
    Object.keys(attributes).forEach((attr) => {
      if (attr.startsWith("@")) {
        el.addEventListener(attr.substr(1), attributes[attr]);
      } else {
        el[attr] = attributes[attr];
      }
    });
    start = 2;
  }

  for (let i = start; i < desc.length; i += 1) {
    if (Array.isArray(desc[i])) {
      el.appendChild(makeDOM.apply(this, desc[i]));
    } else if (desc[i] instanceof Node) {
      el.appendChild(desc[i] as Node);
    } else {
      el.appendChild(document.createTextNode(desc[i] as string));
    }
  }

  return el;
}

export const $el = makeDOM;

// zipBy groups element of an array into a tuple list for a given classifier function
export function zipBy<T>(
  arr: T[],
  classifier: (elem: T) => string,
): Record<string, T[]> {
  const out: Record<string, T[]> = {};
  arr.forEach((elem) => {
    const k = classifier(elem);
    if (!(k in out)) {
      out[k] = [elem];
    } else {
      out[k].push(elem);
    }
  });
  return out;
}
