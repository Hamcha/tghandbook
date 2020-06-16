import * as React from "react";
import WikiPage from "./components/WikiPage";
import TabList, { TabListItem } from "./components/TabList";
import { useState } from "react";

export default function App() {
  const [tabs, setTabs] = useState<TabListItem[]>([
    { page: "Guide_to_medicine" },
    { page: "Guide_to_chemistry" },
  ]);
  const [activeTab, setActiveTab] = useState(0);
  return (
    <React.Fragment>
      <TabList
        tabs={tabs}
        active={activeTab}
        tabClicked={(_tab, i) => setActiveTab(i)}
      />
      <section id="tabs">
        {tabs.map((tab, i) => (
          <WikiPage key={tab.page} page={tab.page} visible={activeTab == i} />
        ))}
      </section>
    </React.Fragment>
  );
}
