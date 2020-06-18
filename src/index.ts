import TabManager from "./TabManager";

const tabListContainer = document.getElementById("tab-list");
const tabContentContainer = document.getElementById("tabs");
const manager = new TabManager(tabListContainer, tabContentContainer);

const defaultTabs = [
  { page: "Guide_to_chemistry", active: true },
  { page: "Guide_to_medicine", active: false },
];

defaultTabs.forEach((tab) => {
  manager.openTab(tab.page, tab.active);
});

if ("serviceWorker" in navigator) {
  const x = "sw.js";
  navigator.serviceWorker
    .register(x)
    .then((registration) => {
      console.log("Registration successful, scope is:", registration.scope);
    })
    .catch((error) => {
      console.log("Service worker registration failed, error:", error);
    });
}
