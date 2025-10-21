import { ButtonLink } from "./button-link";
import "./hero.css";
import { getHighlighter } from "shiki";

const code = `import strawberry


@strawberry.type
class Song:
    id: strawberry.ID
    title: str


@strawberry.type
class Query:
    @strawberry.field
    def song(self, id: strawberry.ID) -> Song:
        return Song(id=id, title="Strawberry Fields Forever")`;

async function getHighlightedCode() {
  const highlighter = await getHighlighter({
    themes: ["github-dark"],
    langs: ["python"],
  });

  const html = highlighter.codeToHtml(code, {
    lang: "python",
    theme: "github-dark",
  });

  return html;
}

export async function Hero() {
  const highlightedCode = await getHighlightedCode();

  return (
    <div className="hero">
      <h1>
        Strawberry is a developer friendly <em>GraphQL library</em> for Python,
        designed for modern development.
      </h1>

      <ButtonLink href="/docs">Get Started</ButtonLink>

      <div
        className="code-wrapper"
        dangerouslySetInnerHTML={{ __html: highlightedCode }}
      />
    </div>
  );
}
