export function findParent(
  base: HTMLElement,
  matchFn: (candidate: HTMLElement) => boolean
): HTMLElement | null {
  let parent = base.parentElement;
  while (parent != null) {
    if (matchFn(parent)) {
      break;
    }
    parent = parent.parentElement;
  }
  return parent;
}

export function nextAnimationFrame(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}

export default { findParent, nextAnimationFrame, delay };
