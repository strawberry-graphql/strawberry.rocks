import { CHAPTERS, LESSONS, lessonPath, type Lesson } from "../../tutorial";
import { applyMarks, type CodeMark } from "../../tutorial/markdown";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useMonaco } from "@monaco-editor/react";
import clsx from "clsx";
import { ArrowLeft, ArrowRight, Menu, SquarePen } from "lucide-react";
import { useEffect, useRef } from "react";

const GITHUB_URL =
  "https://github.com/strawberry-graphql/strawberry.rocks/edit/main/apps/play.strawberry.rocks/src/tutorial";

/** Highlights the lesson's code blocks like the editors */
const LessonBody = ({ html }: { html: string }) => {
  const monaco = useMonaco();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!monaco || !ref.current) {
      return;
    }

    for (const code of ref.current.querySelectorAll<HTMLElement>(
      "pre > code[class*='language-']"
    )) {
      const language = code.className.match(/language-(\w+)/)![1];
      const marks: CodeMark[] = JSON.parse(code.dataset.marks ?? "[]");

      monaco.editor
        .colorize((code.textContent ?? "").trimEnd(), language, { tabSize: 4 })
        .then((colorized) => {
          // Parsed in an inert document, where nothing in it can run
          const parsed = new DOMParser().parseFromString(
            colorized,
            "text/html"
          );

          code.replaceChildren(...parsed.body.childNodes);
          applyMarks(code, marks);
        });
    }
  }, [monaco, html]);

  return (
    <div
      ref={ref}
      className="lesson-prose"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

const lessonSiblings = (lesson: Lesson) => {
  // By slug: the lessons are loaded again when they change in development,
  // while the current one is kept
  const index = LESSONS.findIndex((item) => item.slug === lesson.slug);

  return {
    previous: LESSONS[index - 1] as Lesson | undefined,
    next: LESSONS[index + 1] as Lesson | undefined,
  };
};

/** A link to a lesson that changes lessons without reloading the page */
const LessonLink = ({
  lesson,
  onNavigate,
  ...props
}: {
  lesson: Lesson;
  onNavigate: (lesson: Lesson) => void;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <a
    href={lessonPath(lesson)}
    onClick={(event) => {
      // Let the browser open it in a new tab when asked to
      if (!event.metaKey && !event.ctrlKey && !event.shiftKey) {
        event.preventDefault();
        onNavigate(lesson);
      }
    }}
    {...props}
  />
);

const LessonArrow = ({
  lesson,
  label,
  onNavigate,
  children,
}: {
  lesson: Lesson | undefined;
  label: string;
  onNavigate: (lesson: Lesson) => void;
  children: React.ReactNode;
}) =>
  lesson ? (
    <Button variant="ghost" size="icon" asChild className="text-foreground">
      <LessonLink
        lesson={lesson}
        onNavigate={onNavigate}
        title={`${label}: ${lesson.title}`}
        aria-label={label}
      >
        {children}
      </LessonLink>
    </Button>
  ) : (
    <Button variant="ghost" size="icon" disabled aria-label={label}>
      {children}
    </Button>
  );

/** The lessons menu, arrows to the previous and next lessons, and where we are */
export const TutorialNav = ({
  lesson,
  onNavigate,
}: {
  lesson: Lesson;
  onNavigate: (lesson: Lesson) => void;
}) => {
  const { previous, next } = lessonSiblings(lesson);

  return (
    <div className="flex min-w-0 items-center gap-0.5">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-foreground"
            aria-label="Lessons"
          >
            <Menu />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="max-h-[70vh] w-72 overflow-y-auto"
        >
          {CHAPTERS.map((chapter, index) => (
            <div
              key={chapter.title}
              className={clsx(index > 0 && "mt-1 border-t pt-1")}
            >
              <DropdownMenuLabel className="flex items-center gap-2 pt-2 text-xs font-bold tracking-wider uppercase">
                <span className="w-4 text-center text-strawberry tabular-nums">
                  {index + 1}
                </span>
                {chapter.title}
                {chapter.unreleased ? (
                  <span className="ml-auto rounded-full bg-strawberry/10 px-2 py-0.5 text-[11px] tracking-normal text-strawberry normal-case">
                    Preview
                  </span>
                ) : null}
              </DropdownMenuLabel>
              {/* The line is centered under the number: 8px of padding,
                  plus half its 16px */}
              <div className="mb-1 ml-[15.5px] border-l pl-1.5">
                {chapter.lessons.map((item) => (
                  <DropdownMenuItem
                    key={item.slug}
                    onSelect={() => onNavigate(item)}
                    // Shows where we are in long tutorials
                    ref={
                      item.slug === lesson.slug
                        ? (element) => {
                            element?.scrollIntoView({ block: "center" });
                          }
                        : undefined
                    }
                    className={clsx(
                      item.slug === lesson.slug && "font-bold text-strawberry"
                    )}
                  >
                    {item.title}
                  </DropdownMenuItem>
                ))}
              </div>
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <LessonArrow
        lesson={previous}
        label="Previous lesson"
        onNavigate={onNavigate}
      >
        <ArrowLeft />
      </LessonArrow>
      <LessonArrow lesson={next} label="Next lesson" onNavigate={onNavigate}>
        <ArrowRight />
      </LessonArrow>

      <span className="ml-1 hidden truncate text-sm lg:inline">
        <span className="text-muted-foreground">{lesson.chapter} / </span>
        <span className="font-bold">{lesson.title}</span>
      </span>
    </div>
  );
};

const FooterLink = ({
  lesson,
  label,
  onNavigate,
  className,
}: {
  lesson: Lesson;
  label: string;
  onNavigate: (lesson: Lesson) => void;
  className?: string;
}) => (
  <LessonLink
    lesson={lesson}
    onNavigate={onNavigate}
    className={clsx("group", className)}
  >
    <span className="block text-xs font-bold tracking-wider text-muted-foreground uppercase">
      {label}
    </span>
    <span className="font-display text-lg font-bold text-strawberry group-hover:underline">
      {lesson.title}
    </span>
  </LessonLink>
);

/** The lesson's text, like the left column of the Svelte tutorial */
export const LessonView = ({
  lesson,
  onNavigate,
}: {
  lesson: Lesson;
  onNavigate: (lesson: Lesson) => void;
}) => {
  const { previous, next } = lessonSiblings(lesson);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 });
  }, [lesson]);

  return (
    <div ref={scroller} className="h-full overflow-y-auto bg-background">
      <article className="mx-auto max-w-2xl px-6 pt-8 pb-10 sm:px-10">
        <p className="mb-1 text-sm font-bold text-strawberry">
          {lesson.chapter}
        </p>
        <h1 className="mb-5 font-display text-3xl font-bold tracking-tight">
          {lesson.title}
        </h1>

        {lesson.unreleased ? (
          <p className="mb-5 rounded-lg border border-strawberry/30 bg-strawberry/5 px-4 py-3 text-sm">
            This lesson uses features from an upcoming Strawberry release. It
            only works with the <strong>local</strong> Strawberry version,
            picked at the bottom right.
          </p>
        ) : null}

        <LessonBody html={lesson.html} />

        <a
          href={`${GITHUB_URL}/${lesson.path}/README.md`}
          className="mt-12 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <SquarePen className="size-4" />
          Edit this page on GitHub
        </a>

        <nav className="mt-4 flex justify-between gap-6 border-t pt-5">
          {previous ? (
            <FooterLink
              lesson={previous}
              label="Previous"
              onNavigate={onNavigate}
            />
          ) : (
            <span />
          )}
          {next ? (
            <FooterLink
              lesson={next}
              label="Next"
              onNavigate={onNavigate}
              className="text-right"
            />
          ) : null}
        </nav>
      </article>
    </div>
  );
};
