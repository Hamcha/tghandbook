import TabManager from "./TabManager";
import sections from "./sections";

const sectionListContainer = document.getElementById("section-list");
const tabListContainer = document.getElementById("tab-list");
const tabContentContainer = document.getElementById("tabs");
const manager = new TabManager(
  sectionListContainer,
  tabListContainer,
  tabContentContainer
);

sections.forEach((section) => {
  manager.createSection(section.name);
  section.tabs.forEach((tab) => {
    manager.openTab(section.name, tab.page, { icon: tab.icon, text: tab.text });
  });
});

// Set first page as active
manager.setActive("Medical", "Guide_to_chemistry");

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
