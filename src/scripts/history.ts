import { gotoPage } from "./search";

window.addEventListener("popstate", (ev) => {
  if (ev.state?.page) {
    gotoPage(ev.state.page, ev.state.hash);
  }
});

export function getCurrentPage() {
  // eslint-disable-next-line no-restricted-globals
  const { pathname, hash } = location;

  // Strip prefix
  const prefix = import.meta.env.VITE_PATH ?? "";
  let path = pathname.substring(1 + prefix.length);

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
  const prefix = import.meta.env.VITE_PATH ?? "";
  // eslint-disable-next-line no-restricted-globals
  history.pushState(
    { page, hash },
    "",
    `${prefix}/${pageName}${hash ? `#${hash}` : ""}`
  );
}

export default { getCurrentPage };
