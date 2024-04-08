import React from "react";
import { createContext, useState, useContext } from "react";
import { CodeEditor } from "./components/editor/editor";
import { clsx } from "clsx";

const STARTER_CODE = `
import strawberry

@strawberry.type
class Query:
    @strawberry.field
    def hello() -> str:
        return "world"
`.trim();

const TabsContext = createContext({
  activeTab: 0,
  setActiveTab: (_index: number) => { },
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

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsHeader = ({ children }: { children: React.ReactNode }) => {
  const tabsTitles = React.Children.map(children, (child, index) => {
    return React.cloneElement(child as React.ReactElement, { index });
  });

  return (
    <div className="flex items-center flex-none pl-5 sm:pl-6 pr-4 lg:pr-6 z-10 border-b">
      <div className="flex space-x-5">{tabsTitles}</div>
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
  const { activeTab } = useTabs();

  const active = activeTab === index;

  return (
    <button
      type="button"
      className="relative flex py-3 text-sm leading-6 font-semibold focus:outline-none text-gray-700 hover:text-gray-900 focus:text-gray-900 dark:text-gray-300 dark:hover:text-white"
    >
      <span
        className={clsx(
          "absolute bottom-0 inset-x-0 bg-red-500 h-0.5 rounded-full transition-opacity duration-150",
          { "opacity-0": !active, "opacity-1": active },
        )}
      ></span>
      {children}
    </button>
  );
};

export const Tab = ({ children }: { children: React.ReactNode }) => {
  return children;
};

function App() {
  return (
    <>
      <header className="border-b relative z-20 py-3 pl-5 pr-3 sm:pl-6 sm:pr-4 md:pr-3.5 lg:px-6 flex items-center space-x-4">
        <div className="font-bold text-xl">Strawberry Playground</div>
      </header>

      <div className="divide-x flex">
        <Tabs className="h-screen w-1/3">
          <TabsHeader>
            <TabTitle>Code</TabTitle>
          </TabsHeader>

          <CodeEditor
            source={STARTER_CODE}
            onChange={() => { }}
            language="python"
          />
        </Tabs>
        <Tabs className="h-screen w-1/3">
          <TabsHeader>
            <TabTitle>Query</TabTitle>
            <TabTitle>Variables</TabTitle>
          </TabsHeader>

          <CodeEditor
            source="{ hello }"
            onChange={() => { }}
            language="graphql"
          />
        </Tabs>
        <Tabs className="h-screen w-1/3">
          <TabsHeader>
            <TabTitle>Result</TabTitle>
            <TabTitle>Schema</TabTitle>
          </TabsHeader>
          <CodeEditor
            source={`{
  "hello": "world"
}`}
            language="json"
            readOnly
          />
        </Tabs>
      </div>
    </>
  );
}

export default App;
