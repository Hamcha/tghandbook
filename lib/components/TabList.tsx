import * as React from "react";

export interface TabListItem {
  page: string;
}

export interface TabListProps {
  tabs: TabListItem[];
  active: number;
}

function TabItem({ name, active }) {
  return (
    <div className={active ? "tab active" : "tab"}>
      {name.replace(/_/gi, " ")}
    </div>
  );
}

export default function TabList({ tabs, active }: TabListProps) {
  return (
    <nav className="tab-list">
      {tabs.map((tab, i) => (
        <TabItem name={tab.page} active={i == active} />
      ))}
    </nav>
  );
}
