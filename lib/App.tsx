import * as React from "react";
import TabItem from "./components/TabItem";
import WikiPage from "./components/WikiPage";

export default function App() {
  return (
    <React.Fragment>
      <nav id="tablist">
        <TabItem name="test" />
      </nav>
      <section id="tabs">
        <WikiPage page="Guide_to_medicine" />
      </section>
    </React.Fragment>
  );
}
