import "../scripts/index.ts";
import { process, script } from "../scripts/register.ts";
import { addHistoryEntry } from "../scripts/history.ts";
import { nextAnimationFrame } from "../utils.ts";
import { META, TabInfo } from "./sections.ts";

import unknown from "@assets/images/tab-icons/unknown.svg";
import metaIcon from "@assets/images/icon-meta.svg";
import speen from "@assets/images/speen.svg";

function initWaiting(elem: HTMLElement) {
  // Add spinner
  const spinnerContainer = document.createElement("div");
  spinnerContainer.className = "speen";
  const spinnerImg = document.createElement("img");
  spinnerImg.src = speen;
  spinnerContainer.appendChild(spinnerImg);
  elem.appendChild(spinnerContainer);
}

async function loadPage(
  page: string,
  originalHTML: string,
  elem: HTMLElement,
): Promise<HTMLElement> {
  // Meta pages don't need loading, they are baked in.
  // However they might have scripts we want to run.
  if (page.startsWith("$")) {
    script(page, elem);
    elem.classList.remove("waiting");
    return elem;
  }

  const wrapper = document.createElement("div");
  wrapper.className = "wrapper";

  // Use prefetched non-processed HTML
  let html = originalHTML;

  // Convert relative links to absolute
  html = html.replace(/"\/wiki/gi, '"https://tgstation13.org/wiki');

  await nextAnimationFrame();

  // Set as HTML content and run HTML manipulations on it
  wrapper.innerHTML = html;

  console.log(`${page}: processing`);
  try {
    process(page, wrapper);
  } catch (e) {
    console.error(`Error processing page: ${page}`);
    console.error(e);
  }

  elem.innerHTML = wrapper.outerHTML;
  script(page, elem);
  elem.classList.remove("waiting");

  return elem;
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
  static instance: TabManager;

  sectionListContainer: HTMLElement;
  tabListContainer: HTMLElement;
  tabContentContainer: HTMLElement;
  sections: Record<string, Section> = {};
  sectionMap: Record<string, string> = {};
  loading = false;

  constructor(
    sectionlist: HTMLElement,
    tablist: HTMLElement,
    tabcontent: HTMLElement,
  ) {
    this.sectionListContainer = sectionlist;
    this.tabListContainer = tablist;
    this.tabContentContainer = tabcontent;
    TabManager.instance = this;
  }

  /**
   * Set app-wide loading state
   * @param value is app still loading?
   */
  setLoading(value: boolean): void {
    if (value) {
      document.getElementById("app")?.classList.add("waiting");
      initWaiting(this.tabContentContainer);
      const spinnerContainer = this.tabContentContainer.querySelector(".speen");
      spinnerContainer?.appendChild(
        document.createTextNode("Loading wiki pages"),
      );
    } else {
      document.getElementById("app")!.classList.remove("waiting");
      const elem = this.tabContentContainer.querySelector(".speen")!;
      this.tabContentContainer.removeChild(elem);
    }
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
    if (name === META) {
      const img = document.createElement("img");
      img.src = metaIcon;
      img.className = "meta-icon";
      sectionItem.appendChild(img);
    } else {
      sectionItem.appendChild(document.createTextNode(name));
    }
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
    const active =
      this.sectionListContainer.querySelector<HTMLElement>(".active");
    if (active) {
      // De-activate current section
      active.classList.remove("active");

      // Hide all tabs
      this.tabListContainer
        .querySelectorAll(`div[data-section='${active.dataset.section}']`)
        .forEach((tab) => tab.classList.add("hidden"));
    }
    // Set section as active
    this.sections[name].element.classList.add("active");

    // Show all tabs of that section
    this.tabListContainer
      .querySelectorAll(`div[data-section='${name}']`)
      .forEach((tab) => tab.classList.remove("hidden"));
  }

  /**
   * Open tab page and add it to the tab list
   * @param section Section to add the tab button to
   * @param page Page name
   * @param icon Icon to show
   * @param setActive Also set the tab as active
   */
  async openTab(
    section: string,
    tab: TabInfo,
    {
      active,
    }: {
      active?: boolean;
    },
  ): Promise<void> {
    const page = tab.page;
    const icon = tab.icon;
    const text = tab.text;
    // Create tab list item
    const tabListItem = document.createElement("div");
    tabListItem.className = "tab";
    tabListItem.dataset.section = section;
    tabListItem.dataset.tab = page;
    tabListItem.addEventListener("click", () => {
      if (tabListItem.classList.contains("active")) {
        return;
      }
      this.setActive(page);
      addHistoryEntry(page, "");
    });
    const iconElement = document.createElement("img");
    iconElement.src = icon || unknown;
    tabListItem.title = page.replace(/_/gi, " ");
    tabListItem.appendChild(iconElement);
    const shortTitle = text || page.substr(page.lastIndexOf("_") + 1, 4);
    tabListItem.appendChild(document.createTextNode(shortTitle));
    this.tabListContainer.appendChild(tabListItem);

    // Meta pages are already in the container
    if (page.startsWith("$")) {
      const tabContentItem =
        this.tabContentContainer.querySelector<HTMLDivElement>(
          `div[data-tab='${page}']`,
        )!;

      // Create tab entry
      this.sections[section].tabs[page] = { tabListItem, tabContentItem };
      this.sectionMap[page] = section;
      await loadPage(page, tab.data?.text["*"] || "", tabContentItem);
      return;
    }

    // Create tab content container
    const tabContentItem = document.createElement("div");
    tabContentItem.className = "page waiting";
    tabContentItem.dataset.tab = page;
    initWaiting(tabContentItem);
    this.tabContentContainer.appendChild(tabContentItem);

    // Create tab entry
    this.sections[section].tabs[page] = { tabListItem, tabContentItem };
    this.sectionMap[page] = section;

    // Hide tab if section is hidden
    if (!this.sections[section].element.classList.contains("active")) {
      tabListItem.classList.add("hidden");
    }

    // Start loading page for new tab
    const elem = await loadPage(
      page,
      tab.data?.text["*"] || "",
      tabContentItem,
    );
    // Since element can be replaced (when loading for the first time), make sure the reference is updated
    if (elem !== tabContentItem) {
      this.sections[section].tabs[page].tabContentItem = elem;
    }

    // If asked for, set it to active
    if (active) {
      this.setActive(page);
    }
  }

  /**
   * Set a specific page to be the active/visible one
   * @param page Page name
   */
  setActive(page: string): void {
    // Make sure tab exists (why wouldn't it?!)
    const section = this.sectionMap[page];
    if (!(section in this.sections)) {
      throw new Error("section not found");
    }

    if (!(page in this.sections[section].tabs)) {
      throw new Error("tab not found");
    }

    // Deactivate current active tab
    this.tabListContainer
      .querySelectorAll(".active")
      .forEach((it) => it.classList.remove("active"));
    this.tabContentContainer
      .querySelectorAll(".active")
      .forEach((it) => it.classList.remove("active"));

    // If section is not shown, show it!
    const isSectionActive =
      this.sections[section].element.classList.contains("active");
    if (!isSectionActive) {
      this.showSection(section);
    }

    // Activate new tab
    const { tabListItem, tabContentItem } = this.sections[section].tabs[page];
    this.sections[section].element.classList.add("active");
    tabListItem.classList.add("active");
    tabContentItem.classList.add("active");
  }
}
