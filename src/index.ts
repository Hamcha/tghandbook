import TabManager from "./ui/TabManager";
import sections from "./ui/sections";
import { nextAnimationFrame } from "./utils";
import { gotoPage, searchBox } from "./scripts/search";
import { getCurrentPage } from "./scripts/history";

import unknown from "@/assets/images/tab-icons/unknown.svg";

// Enable single page mode for developing scripts
// const devSinglePage = ["Medical", "Infections"];
const devSinglePage = null;

async function load() {
  const sectionListContainer = document.getElementById("section-list");
  const tabListContainer = document.getElementById("tab-list");
  const tabContentContainer = document.getElementById("tabs");
  const manager = new TabManager(
    sectionListContainer,
    tabListContainer,
    tabContentContainer
  );
  manager.setLoading(true);

  // De-comment to disable caching and force processing
  // manager.cacheEnabled = false;

  // If using single page we're probably in development mode so disable caching
  if (devSinglePage) {
    manager.cacheEnabled = false;
  }

  await nextAnimationFrame();

  // Add loading "bar"
  const spinnerContainer = document.querySelector("#tabs > .speen");
  const icons = document.createElement("div");
  icons.className = "loading-icons";

  let promises = [];
  if (devSinglePage != null) {
    manager.createSection(devSinglePage[0]);
    promises = [manager.openTab(devSinglePage[0], devSinglePage[1], {})];
  } else {
    sections.forEach((section) =>
      section.tabs.forEach((tab) => {
        const iconElement = document.createElement("img");
        iconElement.dataset.tab = tab.page;
        iconElement.src = tab.icon || unknown;
        iconElement.title = tab.page.replace(/_/gi, " ");
        icons.appendChild(iconElement);
      })
    );
    spinnerContainer.appendChild(icons);

    promises = sections.flatMap((section) => {
      manager.createSection(section.name);

      return section.tabs.map(async (tab) => {
        // Load page
        await manager.openTab(section.name, tab.page, {
          icon: tab.icon,
          text: tab.text,
        });
        // Remove icon from loading
        icons.removeChild(icons.querySelector(`img[data-tab='${tab.page}']`));
      });
    });
  }

  Promise.all(promises).then(() => {
    // Remove app-wide loading
    manager.setLoading(false);
    if (devSinglePage) {
      manager.setActive(devSinglePage[1]);
    } else {
      const { path, hash } = getCurrentPage();

      // Try to open page from URL, open landing page if fail
      if (!gotoPage(path, hash)) {
        manager.setActive("$Welcome");
        manager.showSection("Medical");
      }
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
  .appendChild(
    document.createTextNode(import.meta.env.VITE_APP_REVISION || "unknown")
  );
