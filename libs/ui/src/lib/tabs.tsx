import { useState } from "react";

import styles from "../styles/components/tabs.module.scss";

type TabData = {
  title: string;
  content: React.ReactNode[];
};

export default function Tabs({ tabsData }: { tabsData: TabData[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className={styles.tabs}>
      <div className={styles.tabs__container}>
        <nav className={styles.tabs__navigation}>
          {tabsData.map((tab, index) => (
            <button
              key={index}
              className={`${styles.tabs__button} ${activeIndex === index ? styles.tabs__button_active : ""}`}
              onClick={() => setActiveIndex(index)}
            >
              {tab.title}
            </button>
          ))}
        </nav>
        <div className={styles.tabs__body}>
          {tabsData.map((tab, index) => (
            <div
              key={index}
              className={`${styles.tabs__section} ${activeIndex === index ? styles.tabs__section_active : ""}`}
            >
              {tab.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export { default as Tabs } from "./tabs";