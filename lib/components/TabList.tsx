import * as React from "react";

export interface TabListItem {
  page: string;
}

export interface TabListProps {
  tabs: TabListItem[];
  active: number;
  tabClicked: (TabListItem, number) => void;
}

function TabItem({ name, active, onClick }) {
  const clickHandler = active ? null : onClick;
  return (
    <div
      className={active ? "tab active" : "tab clickable"}
      onClick={clickHandler}
    >
      {name.replace(/_/gi, " ")}
    </div>
  );
}

export default function TabList({ tabs, active, tabClicked }: TabListProps) {
  return (
    <nav className="tab-list">
      {tabs.map((tab, i) => (
        <TabItem
          key={tab.page}
          name={tab.page}
          active={i == active}
          onClick={() => tabClicked(tab, i)}
        />
      ))}
    </nav>
  );
}
