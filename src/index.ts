import TabManager from "./ui/TabManager.ts";
import sections from "./ui/sections.ts";
import { nextAnimationFrame } from "./utils.ts";
import { gotoPage, searchBox } from "./scripts/search.ts";
import { getCurrentPage } from "./scripts/history.ts";

async function load() {
  const sectionListContainer = document.getElementById("section-list")!;
  const tabListContainer = document.getElementById("tab-list")!;
  const tabContentContainer = document.getElementById("tabs")!;
  const manager = new TabManager(
    sectionListContainer,
    tabListContainer,
    tabContentContainer,
  );
  manager.setLoading(true);

  await nextAnimationFrame();

  const promises = sections.flatMap((section) => {
    manager.createSection(section.name);

    return section.tabs.map(async (tab) => {
      // Load page
      await manager.openTab(section.name, tab, {});
    });
  });

  Promise.all(promises).then(() => {
    // Remove app-wide loading
    manager.setLoading(false);

    const { path, hash } = getCurrentPage();

    // Try to open page from URL, open landing page if fail
    if (!gotoPage(path, hash)) {
      manager.setActive("$Welcome");
      manager.showSection("Medical");
    }
  });
}

if ("serviceWorker" in navigator) {
  const x = import.meta.env.VITE_SUBDIR
    ? `${import.meta.env.VITE_SUBDIR}/sw.js`
    : "sw.js";
  navigator.serviceWorker
    .register(x)
    .then((registration) => {
      console.log("Registration successful, scope is:", registration.scope);
    })
    .catch((error) => {
      console.log("Service worker registration failed, error:", error);
    });
}

// Start loading pages
load();

// Add search box
document.body.appendChild(searchBox());

// Add revision info
document
  .getElementById("tgh-version")
  ?.appendChild(
    document.createTextNode(import.meta.env.VITE_APP_REVISION || "unknown"),
  );
