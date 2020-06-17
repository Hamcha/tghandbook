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
