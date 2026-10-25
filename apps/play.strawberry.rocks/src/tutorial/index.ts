import { renderMarkdown } from "./markdown";
import type { EditorState } from "@/editor-state";

// Chapters are folders with a meta.json, and lessons are folders inside them
// with a README.md, the code to start from in app-a and the solution in
// app-b. Folders are sorted by their number prefix, which is left out of
// the lesson's URL. Files missing from app-a are the same as at the end of
// the previous lesson, and files missing from app-b are the same as in app-a
const files = import.meta.glob<string>(
  ["./*/meta.json", "./*/*/README.md", "./*/*/app-*/*"],
  { query: "?raw", import: "default", eager: true }
);

const FILE_NAMES: Record<keyof EditorState, string> = {
  code: "schema.py",
  query: "query.graphql",
  variables: "variables.json",
  headers: "headers.json",
};

const EMPTY_STATE: EditorState = {
  code: "",
  query: "",
  variables: "{}",
  headers: "{}",
};

export type Lesson = {
  slug: string;
  title: string;
  chapter: string;
  /** The lesson's text, as HTML */
  html: string;
  /** The lesson's folder, from src/tutorial */
  path: string;
  start: EditorState;
  /** Not set for lessons that don't ask for changes */
  solution: EditorState | null;
};

export type Chapter = { title: string; lessons: Lesson[] };

const parseFrontmatter = (text: string) => {
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  const data: Record<string, string> = {};

  for (const line of match?.[1].split("\n") ?? []) {
    const [key, ...value] = line.split(":");
    data[key.trim()] = value.join(":").trim();
  }

  return { data, body: match ? text.slice(match[0].length) : text };
};

/** The app's files in a lesson folder, or null if it has none */
const readApp = (dir: string, fallback: EditorState) => {
  let found = false;
  const state = { ...fallback };

  for (const key of Object.keys(FILE_NAMES) as (keyof EditorState)[]) {
    const content = files[`${dir}/${FILE_NAMES[key]}`];

    if (content !== undefined) {
      state[key] = content.trimEnd();
      found = true;
    }
  }

  return found ? state : null;
};

const subfolders = (dir: string) =>
  [
    ...new Set(
      Object.keys(files)
        .filter((path) => path.startsWith(`${dir}/`))
        .map((path) => path.slice(dir.length + 1).split("/")[0])
        .filter((name) => !name.includes("."))
    ),
  ].sort();

const stripOrder = (name: string) => name.replace(/^\d+-/, "");

const loadChapters = () => {
  const chapters: Chapter[] = [];
  let previous = EMPTY_STATE;

  for (const chapterDir of subfolders(".")) {
    const meta = JSON.parse(files[`./${chapterDir}/meta.json`]);
    const chapter: Chapter = { title: meta.title, lessons: [] };

    for (const lessonDir of subfolders(`./${chapterDir}`)) {
      const dir = `./${chapterDir}/${lessonDir}`;
      const readme = files[`${dir}/README.md`];

      if (readme === undefined) {
        throw new Error(`Lesson ${dir} has no README.md`);
      }

      const { data, body } = parseFrontmatter(readme);
      const start = readApp(`${dir}/app-a`, previous) ?? previous;
      const solution = readApp(`${dir}/app-b`, start);

      chapter.lessons.push({
        slug: stripOrder(lessonDir),
        title: data.title ?? stripOrder(lessonDir),
        chapter: chapter.title,
        html: renderMarkdown(body),
        path: `${chapterDir}/${lessonDir}`,
        start,
        solution,
      });
      previous = solution ?? start;
    }

    chapters.push(chapter);
  }

  return chapters;
};

export const CHAPTERS = loadChapters();

export const LESSONS = CHAPTERS.flatMap((chapter) => chapter.lessons);

if (new Set(LESSONS.map((lesson) => lesson.slug)).size !== LESSONS.length) {
  throw new Error("Lesson folders must have unique names");
}

export const lessonPath = (lesson: Lesson) => `/tutorial/${lesson.slug}`;

/**
 * The lesson for a URL path, null when it's not in the tutorial. /tutorial,
 * and lessons that don't exist, are the first lesson
 */
export const findLesson = (pathname: string) => {
  const match = pathname.match(/^\/tutorial(?:\/([^/]+))?\/?$/);

  if (!match) {
    return null;
  }

  return LESSONS.find((lesson) => lesson.slug === match[1]) ?? LESSONS[0];
};
