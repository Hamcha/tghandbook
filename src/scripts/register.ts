export type ProcessFn = (root: HTMLElement, docname: string) => void;

export const GLOBAL = "_GLOBAL";
export const GENERIC = "_GENERIC";

export const preprocess: Record<string, ProcessFn> = {};
export const scripts: Record<string, ProcessFn> = {};

/**
 * Register custom preprocessing script for a given page.
 * The script will run after downloading the page but before it is saved.
 * @param page Page ID
 * @param fn Script to run after downloading page
 */
export function registerProcess(page: string, fn: ProcessFn) {
  preprocess[page] = fn;
}

/**
 * Register custom postprocessing script for a given page.
 * This is mostly for registering search entries and other runtime scripts.
 * The script will run after loading the page from cache but before the UI is loaded.
 * @param page Page ID
 * @param fn Script to run after downloading page
 */
export function registerScript(page: string, fn: ProcessFn) {
  scripts[page] = fn;
}

/**
 * Run preprocessing on a freshly downloaded page
 * Runs a global script (if registered) or a generic script if a specific wasn't found.
 * @param page Page ID
 * @param root HTML root element
 */
export function process(page: string, root: HTMLElement) {
  if (GLOBAL in preprocess) {
    preprocess[GLOBAL](root, page);
  }
  if (page in preprocess) {
    preprocess[page](root, page);
  } else if (GENERIC in preprocess) {
    preprocess[GENERIC](root, page);
  }
}

/**
 * Run postprocessing (setup for runtime scripts) on saved pages
 * Runs a global script (if registered) or a generic script if a specific wasn't found.
 * @param page Page ID
 * @param root HTML root element
 */
export function script(page: string, root: HTMLElement) {
  if (GLOBAL in scripts) {
    scripts[GLOBAL](root, page);
  }
  if (page in scripts) {
    scripts[page](root, page);
  } else if (GENERIC in scripts) {
    scripts[GENERIC](root, page);
  }
}
