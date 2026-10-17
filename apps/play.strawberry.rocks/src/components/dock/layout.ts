import type { DockviewApi } from "dockview-react";

export const PANELS = {
  code: "schema.py",
  query: "Query",
  variables: "Variables",
  requestHeaders: "Headers",
  response: "Response",
  console: "Console",
  headers: "Response headers",
  schema: "Schema",
} as const;

export type PanelId = keyof typeof PANELS;

const STORAGE_KEY = "playground-layout";

const addPanel = (
  api: DockviewApi,
  id: PanelId,
  position?: {
    referencePanel: PanelId;
    direction: "right" | "below" | "within";
  }
) =>
  api.addPanel({
    id,
    component: "panel",
    title: PANELS[id],
    position,
    inactive: position?.direction === "within",
  });

/** schema.py | Query over Variables and Headers | the results as tabs */
export const applyDefaultLayout = (api: DockviewApi) => {
  api.clear();

  const code = addPanel(api, "code");
  addPanel(api, "query", { referencePanel: "code", direction: "right" });
  const response = addPanel(api, "response", {
    referencePanel: "query",
    direction: "right",
  });
  const variables = addPanel(api, "variables", {
    referencePanel: "query",
    direction: "below",
  });
  addPanel(api, "requestHeaders", {
    referencePanel: "variables",
    direction: "within",
  });
  addPanel(api, "console", { referencePanel: "response", direction: "within" });
  addPanel(api, "headers", { referencePanel: "response", direction: "within" });
  addPanel(api, "schema", { referencePanel: "response", direction: "within" });

  code.group.api.setSize({ width: api.width * 0.38 });
  response.group.api.setSize({ width: api.width * 0.34 });
  variables.group.api.setSize({ height: api.height * 0.35 });
  code.api.setActive();
};

/** Restores the layout the user arranged last time, if there is one */
export const restoreLayout = (api: DockviewApi) => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      api.fromJSON(JSON.parse(saved));

      // A layout saved before a panel was added (or removed) is outdated
      const ids = new Set(api.panels.map((panel) => panel.id));
      const expected = Object.keys(PANELS);

      if (ids.size === expected.length && expected.every((id) => ids.has(id))) {
        return;
      }
    }
  } catch {
    // Unreadable layout or storage, fall back to the default one
  }

  applyDefaultLayout(api);
};

export const saveLayout = (api: DockviewApi) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(api.toJSON()));
  } catch {
    // Storage can be unavailable, e.g. in private windows
  }
};
