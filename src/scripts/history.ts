import { gotoPage } from "./search";

window.addEventListener("popstate", (ev) => {
  if (ev.state?.page) {
    gotoPage(ev.state.page, ev.state.hash);
  }
});

export function getCurrentPage() {
  // eslint-disable-next-line no-restricted-globals
  const { pathname, hash } = location;

  // Strip first character
  let path = pathname.substring(1);

  if (path.startsWith("meta/")) {
    path = `$${path.substring(5)}`;
  }

  return { path, hash: hash.substring(1) };
}

export function addHistoryEntry(page: string, hash: string) {
  let pageName = `/${page}`;
  if (page.startsWith("$")) {
    if (page === "$Welcome") {
      pageName = "/";
    } else {
      pageName = `/meta/${page.substring(1)}`;
    }
  }
  // eslint-disable-next-line no-restricted-globals
  history.pushState({ page, hash }, "", pageName + (hash ? `#${hash}` : ""));
}

export default { getCurrentPage };
