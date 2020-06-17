import speen from "~/assets/images/speen.svg";
import { getPageHTML } from "./wiki";
import userscript from "./userscript";

function initWaiting(elem: HTMLElement) {
  // Add spinner
  const spinnerContainer = document.createElement("div");
  spinnerContainer.className = "speen";
  const spinnerImg = document.createElement("img");
  spinnerImg.src = speen;
  spinnerContainer.appendChild(spinnerImg);
  const spinnerText = document.createElement("p");
  spinnerText.appendChild(
    document.createTextNode("You start skimming through the manual...")
  );
  spinnerContainer.appendChild(spinnerText);
  elem.appendChild(spinnerContainer);
}

async function loadPage(page: string, elem: HTMLElement) {
  console.log(page + ": fetching");
  let html = await getPageHTML(page);
  // Convert relative links to absolute
  html = html.replace(/"\/wiki/gi, '"//tgstation13.org/wiki');
  elem.innerHTML = html;
  console.log(page + ": processing");
  userscript(elem, page);
  console.log(page + ": userscript applied");
  elem.classList.remove("waiting");
}

type TabElements = { tabListItem: HTMLElement; tabContentItem: HTMLElement };

export default class TabManager {
  tabListContainer: HTMLElement;
  tabContentContainer: HTMLElement;
  tabs: Record<string, TabElements> = {};

  constructor(tablist: HTMLElement, tabcontent: HTMLElement) {
    this.tabListContainer = tablist;
    this.tabContentContainer = tabcontent;
  }

  openTab(page: string, setActive: boolean) {
    // Create tab list item
    const tabListItem = document.createElement("div");
    tabListItem.className = "tab";
    tabListItem.dataset.tab = page;
    tabListItem.addEventListener("click", () => {
      if (tabListItem.classList.contains("active")) {
        return;
      }
      this.setActive(page);
    });
    tabListItem.appendChild(document.createTextNode(page.replace(/_/gi, " ")));
    this.tabListContainer.appendChild(tabListItem);

    // Create tab content container
    const tabContentItem = document.createElement("div");
    tabContentItem.className = "page waiting";
    tabContentItem.dataset.tab = page;
    initWaiting(tabContentItem);
    this.tabContentContainer.appendChild(tabContentItem);

    // Start loading page for new tab
    loadPage(page, tabContentItem);

    // Create tab entry
    this.tabs[page] = { tabListItem, tabContentItem };

    // If asked for, set it to active
    if (setActive) {
      this.setActive(page);
    }
  }

  setActive(page: string) {
    // Make sure tab exists (why wouldn't it?!)
    if (!(page in this.tabs)) {
      throw new Error("tab not found");
    }

    // Deactivate current active tab
    this.tabListContainer
      .querySelectorAll(".active")
      .forEach((it) => it.classList.remove("active"));
    this.tabContentContainer
      .querySelectorAll(".active")
      .forEach((it) => it.classList.remove("active"));

    // Activate new tab
    const { tabListItem, tabContentItem } = this.tabs[page];
    tabListItem.classList.add("active");
    tabContentItem.classList.add("active");
  }
}
