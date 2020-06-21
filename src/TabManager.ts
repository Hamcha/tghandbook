// @ts-expect-error: Asset imports are handled by parcel
import speen from "~/assets/images/speen.svg";
import { getPageHTML } from "./wiki";
import { processHTML, bindFunctions, CURRENT_VERSION } from "./userscript";
import cache from "./cache";
import { nextAnimationFrame } from "./utils";

// @ts-expect-error: Parcel image import
import unknown from "~/assets/images/tab-icons/unknown.svg";

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
  let html: string | null = null;
  const key = `page:${page}`;

  // Check cache for pre-processed page
  try {
    const cachedPage = await cache.get<string>(key);
    if (cachedPage) {
      if (cachedPage.version === CURRENT_VERSION) {
        console.log(`${page}: found cached entry`);
        html = cachedPage.value;
      } else {
        console.log(`${page}: found outdated cache entry`);
      }
    }
  } catch (e) {
    console.log(`${page}: failed to retrieve cache entry:`, e);
  }

  // Fetch page content
  if (!html) {
    console.log(`${page}: fetching`);
    html = await getPageHTML(page);

    // Convert relative links to absolute (and proxied)
    html = html.replace(/"\/wiki/gi, '"//tgproxy.ovo.ovh/wiki');

    await nextAnimationFrame();

    // Set as HTML content and run HTML manipulations on it
    elem.innerHTML = html;

    console.log(`${page}: processing`);
    processHTML(elem, page);

    // Save result to cache
    cache.set(key, elem.innerHTML, CURRENT_VERSION).then(() => {
      console.log(`${page}: saved to cache`);
    });
  } else {
    // Set cached content as HTML
    elem.innerHTML = html;
  }

  bindFunctions(elem, page);
  console.log(`${page}: userscript applied`);
  elem.classList.remove("waiting");
}

type TabElements = {
  tabListItem: HTMLElement;
  tabContentItem: HTMLElement;
};

interface Section {
  name: string;
  element: HTMLElement;
  tabs: Record<string, TabElements>;
}

export default class TabManager {
  sectionListContainer: HTMLElement;

  tabListContainer: HTMLElement;

  tabContentContainer: HTMLElement;

  sections: Record<string, Section> = {};

  constructor(
    sectionlist: HTMLElement,
    tablist: HTMLElement,
    tabcontent: HTMLElement
  ) {
    this.sectionListContainer = sectionlist;
    this.tabListContainer = tablist;
    this.tabContentContainer = tabcontent;
  }

  /**
   * Create section and add it to the section list
   * @param name Section name
   */
  createSection(name: string): void {
    // Create section element
    const sectionItem = document.createElement("div");
    sectionItem.className = "section";
    sectionItem.dataset.section = name;
    sectionItem.appendChild(document.createTextNode(name));
    sectionItem.addEventListener("click", () => {
      if (sectionItem.classList.contains("active")) {
        return;
      }
      this.showSection(name);
    });
    this.sectionListContainer.appendChild(sectionItem);

    this.sections[name] = { name, element: sectionItem, tabs: {} };
  }

  /**
   * Show tabs of a specific section
   * @param name Section name
   */
  showSection(name: string): void {
    const active = this.sectionListContainer.querySelector<HTMLElement>(
      ".active"
    );
    if (active) {
      // De-activate current section
      active.classList.remove("active");

      // Hide all tabs
      this.tabListContainer
        .querySelectorAll(`div[data-section=${active.dataset.section}]`)
        .forEach((tab) => tab.classList.add("hidden"));
    }
    // Set section as active
    this.sections[name].element.classList.add("active");

    // Show all tabs of that section
    this.tabListContainer
      .querySelectorAll(`div[data-section=${name}]`)
      .forEach((tab) => tab.classList.remove("hidden"));
  }

  /**
   * Open tab page and add it to the tab list
   * @param section Section to add the tab button to
   * @param page Page name
   * @param icon Icon to show
   * @param setActive Also set the tab as active
   */
  openTab(
    section: string,
    page: string,
    options: {
      icon?: string;
      active?: boolean;
      text?: string;
    }
  ): void {
    // Create tab list item
    const tabListItem = document.createElement("div");
    tabListItem.className = "tab";
    tabListItem.dataset.section = section;
    tabListItem.dataset.tab = page;
    tabListItem.addEventListener("click", () => {
      if (tabListItem.classList.contains("active")) {
        return;
      }
      this.setActive(section, page);
    });
    const iconElement = document.createElement("img");
    iconElement.src = options.icon || unknown;
    tabListItem.title = page.replace(/_/gi, " ");
    tabListItem.appendChild(iconElement);
    const shortTitle =
      options.text || page.substr(page.lastIndexOf("_") + 1, 4);
    tabListItem.appendChild(document.createTextNode(shortTitle));
    this.tabListContainer.appendChild(tabListItem);

    // Create tab content container
    const tabContentItem = document.createElement("div");
    tabContentItem.className = "page waiting";
    tabContentItem.dataset.tab = page;
    initWaiting(tabContentItem);

    // Start loading page for new tab
    loadPage(page, tabContentItem);

    this.tabContentContainer.appendChild(tabContentItem);

    // Create tab entry
    this.sections[section].tabs[page] = { tabListItem, tabContentItem };

    // Hide tab if section is hidden
    if (!this.sections[section].element.classList.contains("active")) {
      tabListItem.classList.add("hidden");
    }

    // If asked for, set it to active
    if (options.active) {
      this.setActive(section, page);
    }
  }

  /**
   * Set a specific page to be the active/visible one
   * @param section Section name
   * @param page Page name
   */
  setActive(section: string, page: string): void {
    // Make sure tab exists (why wouldn't it?!)
    if (!(section in this.sections)) {
      throw new Error("section not found");
    }

    if (!(page in this.sections[section].tabs)) {
      throw new Error("tab not found");
    }

    // Deactivate current active tab
    this.sectionListContainer
      .querySelectorAll(".active")
      .forEach((it) => it.classList.remove("active"));
    this.tabListContainer
      .querySelectorAll(".active")
      .forEach((it) => it.classList.remove("active"));
    this.tabContentContainer
      .querySelectorAll(".active")
      .forEach((it) => it.classList.remove("active"));

    // If section is not shown, show it!
    if (!this.sections[section].element.classList.contains("active")) {
      this.showSection(section);
    }

    // Activate new tab
    const { tabListItem, tabContentItem } = this.sections[section].tabs[page];
    this.sections[section].element.classList.add("active");
    tabListItem.classList.add("active");
    tabContentItem.classList.add("active");
  }
}
