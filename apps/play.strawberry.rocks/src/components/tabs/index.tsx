import clsx from "clsx";
import React, { createContext, useContext, useState } from "react";

const TabsContext = createContext({
  activeTab: 0,
  setActiveTab: (_index: number) => {},
});

const useTabs = () => useContext(TabsContext);

export const Tabs = ({
  children,
  className,
  actions,
}: {
  children: React.ReactNode;
  className?: string;
  /** Shown at the end of the tab bar */
  actions?: React.ReactNode;
}) => {
  const [activeTab, setActiveTab] = useState(0);

  // all children should be Tab components, get their titles for the header
  const tabsTitles = React.Children.map(children, (child) => {
    return (child as React.ReactElement<{ title: React.ReactNode }>).props
      .title;
  })!;

  const childrenArray = React.Children.toArray(children);

  const activeTabContent = childrenArray[activeTab];
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div
        className={clsx(
          className,
          "grid min-h-0 grid-rows-[auto_1fr] bg-background"
        )}
      >
        <div
          role="tablist"
          className="flex h-9 items-center gap-4 border-b bg-chrome px-4"
        >
          {tabsTitles.map((title, index) => (
            <TabTitle key={index} index={index}>
              {title}
            </TabTitle>
          ))}
          {actions ? (
            <div className="ml-auto flex items-center">{actions}</div>
          ) : null}
        </div>
        <div className="min-h-0 min-w-0 overflow-hidden">
          {activeTabContent}
        </div>
      </div>
    </TabsContext.Provider>
  );
};

const TabTitle = ({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) => {
  const { activeTab, setActiveTab } = useTabs();

  const active = activeTab === index;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      className={clsx(
        "relative flex h-full items-center text-[13px] font-bold transition-colors focus-visible:outline-hidden focus-visible:text-foreground",
        active
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground"
      )}
      onClick={() => setActiveTab(index)}
    >
      {children}
      <span
        className={clsx(
          "absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-linear-to-r from-magenta to-orange transition-opacity",
          active ? "opacity-100" : "opacity-0"
        )}
      />
    </button>
  );
};

export const Tab = ({
  children,
}: {
  children: React.ReactNode;
  title: React.ReactNode;
}) => {
  return children;
};
