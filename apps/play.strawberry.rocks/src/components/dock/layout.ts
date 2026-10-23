import type { DockviewApi } from "dockview-react";

export const PANELS = {
  lesson: "Lesson",
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

/** The tutorial adds a pane with the lesson */
export type LayoutMode = "playground" | "tutorial";

const STORAGE_KEYS: Record<LayoutMode, string> = {
  playground: "playground-layout",
  tutorial: "playground-tutorial-layout",
};

const panelIds = (mode: LayoutMode) =>
  (Object.keys(PANELS) as PanelId[]).filter(
    (id) => mode === "tutorial" || id !== "lesson"
  );

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
export const applyDefaultLayout = (api: DockviewApi, mode: LayoutMode) => {
  if (mode === "tutorial") {
    applyTutorialLayout(api);
    return;
  }

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

/**
 * The lesson is a plain column, like the text of the Svelte tutorial: no tab
 * to drag it around by, and nothing can be dropped in it
 */
const pinLesson = (api: DockviewApi) => {
  const group = api.getPanel("lesson")?.group;

  if (group) {
    group.header.hidden = true;
    group.locked = "no-drop-target";
  }
};

/**
 * The lesson | schema.py and Query, Variables and Headers side by side, over
 * the results as tabs
 */
const applyTutorialLayout = (api: DockviewApi) => {
  api.clear();

  const lesson = addPanel(api, "lesson");
  const code = addPanel(api, "code", {
    referencePanel: "lesson",
    direction: "right",
  });
  const response = addPanel(api, "response", {
    referencePanel: "code",
    direction: "below",
  });
  addPanel(api, "query", { referencePanel: "code", direction: "right" });
  addPanel(api, "variables", { referencePanel: "query", direction: "within" });
  addPanel(api, "requestHeaders", {
    referencePanel: "query",
    direction: "within",
  });
  addPanel(api, "console", { referencePanel: "response", direction: "within" });
  addPanel(api, "headers", { referencePanel: "response", direction: "within" });
  addPanel(api, "schema", { referencePanel: "response", direction: "within" });

  pinLesson(api);
  lesson.group.api.setSize({ width: api.width * 0.36 });
  code.group.api.setSize({ width: (api.width * 0.64) / 2 });
  response.group.api.setSize({ height: api.height * 0.42 });
  code.api.setActive();
};

/** Restores the layout the user arranged last time, if there is one */
export const restoreLayout = (api: DockviewApi, mode: LayoutMode) => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS[mode]);

    if (saved) {
      api.fromJSON(JSON.parse(saved));

      // A layout saved before a panel was added (or removed) is outdated
      const ids = new Set(api.panels.map((panel) => panel.id));
      const expected = panelIds(mode);

      if (ids.size === expected.length && expected.every((id) => ids.has(id))) {
        if (mode === "tutorial") {
          pinLesson(api);
        }

        return;
      }
    }
  } catch {
    // Unreadable layout or storage, fall back to the default one
  }

  applyDefaultLayout(api, mode);
};

export const saveLayout = (api: DockviewApi, mode: LayoutMode) => {
  try {
    localStorage.setItem(STORAGE_KEYS[mode], JSON.stringify(api.toJSON()));
  } catch {
    // Storage can be unavailable, e.g. in private windows
  }
};
