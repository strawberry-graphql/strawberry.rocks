import clsx from "clsx";
import React, { createContext, useContext, useState } from "react";

const TabsContext = createContext({
  activeTab: 0,
  setActiveTab: (_index: number) => {},
});

const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("useTabs must be used within a TabsProvider");
  }
  return context;
};

export const Tabs = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const [activeTab, setActiveTab] = useState(0);

  // all children should be Tab components
  // we need to pass the activeTab and setActiveTab to the Tab components
  // get all title props from the tabs
  const tabsTitles = React.Children.map(children, (child) => {
    return (child as React.ReactElement).props.title;
  })!;

  const childrenArray = React.Children.toArray(children);

  const activeTabContent = childrenArray[activeTab];
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div
        className={clsx(className, "grid grid-rows-[50px_1fr] dark:bg-dark")}
      >
        <TabsHeader>
          {tabsTitles.map((title, index) => (
            <TabTitle key={index} index={index}>
              {title}
            </TabTitle>
          ))}
        </TabsHeader>
        <div className="min-h-0 min-w-0">{activeTabContent}</div>
      </div>
    </TabsContext.Provider>
  );
};

export const TabsHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center flex-none pl-5 sm:pl-6 pr-4 lg:pr-6 z-10 border-b">
      <div className="flex space-x-5">{children}</div>
    </div>
  );
};

export const TabTitle = ({
  children,
  index,
}: {
  children: React.ReactNode;
  index?: number;
}) => {
  const { activeTab, setActiveTab } = useTabs();

  const active = activeTab === index;

  return (
    <button
      type="button"
      className="relative flex py-3 text-sm leading-6 font-semibold focus:outline-none text-gray-700 hover:text-gray-900 focus:text-gray-900 dark:text-gray-300 dark:hover:text-white"
      onClick={() => index !== undefined && setActiveTab(index)}
    >
      <span
        className={clsx(
          "absolute bottom-0 inset-x-0 bg-red-500 h-0.5 rounded-full transition-opacity duration-150",
          { "opacity-0": !active, "opacity-1": active }
        )}
      ></span>
      {children}
    </button>
  );
};

export const Tab = ({
  children,
}: {
  children: React.ReactNode;
  title: string;
}) => {
  return children;
};
