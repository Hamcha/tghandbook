import TabManager from "./ui/TabManager";
import sections from "./ui/sections";
import { nextAnimationFrame } from "./utils";
import { searchBox } from "./scripts/search";

// @ts-expect-error: Parcel image import
import unknown from "~/assets/images/tab-icons/unknown.svg";
import { bindFunctions } from "./scripts/index";

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

  await nextAnimationFrame();

  // Add loading "bar"
  const spinnerContainer = document.querySelector("#tabs > .speen");
  const icons = document.createElement("div");
  icons.className = "loading-icons";
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

  const promises = sections.flatMap((section) => {
    manager.createSection(section.name);

    return section.tabs.map(async (tab) => {
      // Load page
      await manager.openTab(section.name, tab.page, {
        icon: tab.icon,
        text: tab.text,
      });
      // Remove icon from loading
      icons.removeChild(icons.querySelector(`img[data-tab=${tab.page}]`));
    });
  });

  manager.showSection("Medical");
  // DEV: If you only need one page just comment the block above and uncomment this:
  // manager.createSection("Medical");
  // const promises = [manager.openTab("Medical", "Infections", {})];

  const welcome = document.getElementById("Welcome");
  bindFunctions(welcome, "$Welcome");

  Promise.all(promises).then(() => {
    // Remove app-wide loading
    manager.setLoading(false);
    welcome.classList.add("active");
  });
}
if ("serviceWorker" in navigator) {
  const x = process.env.SUBPATH ? `${process.env.SUBPATH}/sw.js` : "sw.js";
  navigator.serviceWorker
    .register(x)
    .then((registration) => {
      console.log("Registration successful, scope is:", registration.scope);
    })
    .catch((error) => {
      console.log("Service worker registration failed, error:", error);
    });
}

load();

document.body.appendChild(searchBox());
