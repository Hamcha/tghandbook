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

export default { nextAnimationFrame, delay };
