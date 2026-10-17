import { useTheme } from "../theme-context";
import { restoreLayout, saveLayout, type PanelId } from "./layout";
import {
  DockviewReact,
  themeDark,
  themeLight,
  type DockviewApi,
  type IDockviewHeaderActionsProps,
  type IDockviewPanelHeaderProps,
  type IDockviewPanelProps,
} from "dockview-react";
import "dockview-react/dist/styles/dockview.css";
import { createContext, useContext } from "react";

type DockContent = {
  panels: Record<PanelId, React.ReactNode>;
  /** Shown next to a tab's title, e.g. the number of console entries */
  badges: Partial<Record<PanelId, React.ReactNode>>;
  /** Shown at the end of the tab bar that holds the response */
  status: React.ReactNode;
};

// Dockview renders panels through portals, so they can read this context
const DockContentContext = createContext<DockContent | null>(null);

const useDockContent = () => useContext(DockContentContext)!;

const PanelContent = ({ api }: IDockviewPanelProps) => {
  const { panels } = useDockContent();

  return <div className="h-full">{panels[api.id as PanelId]}</div>;
};

// No close button: every pane should stay around, and can only be moved
const PanelTab = ({ api }: IDockviewPanelHeaderProps) => {
  const { badges } = useDockContent();

  return (
    <div className="relative flex h-full items-center px-3 font-medium">
      {api.title}
      {badges[api.id as PanelId]}
      <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-strawberry opacity-0 in-[.dv-active-tab]:opacity-100" />
    </div>
  );
};

const HeaderActions = ({ panels }: IDockviewHeaderActionsProps) => {
  const { status } = useDockContent();

  return panels.some((panel) => panel.id === "response") ? (
    <div className="flex h-full items-center px-3">{status}</div>
  ) : null;
};

const components = { panel: PanelContent };

export const DockLayout = ({
  onReady,
  ...content
}: DockContent & { onReady: (api: DockviewApi) => void }) => {
  const { actualTheme } = useTheme();

  return (
    <DockContentContext.Provider value={content}>
      <div className="playground-dock h-full">
        <DockviewReact
          components={components}
          defaultTabComponent={PanelTab}
          rightHeaderActionsComponent={HeaderActions}
          theme={actualTheme === "dark" ? themeDark : themeLight}
          // Keeps hidden tabs in the page, so editors keep their scroll
          // position and don't have to be laid out again when shown
          defaultRenderer="always"
          disableFloatingGroups
          onReady={({ api }) => {
            restoreLayout(api);
            api.onDidLayoutChange(() => saveLayout(api));
            onReady(api);
          }}
        />
      </div>
    </DockContentContext.Provider>
  );
};
