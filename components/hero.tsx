import { CodeBlock } from "./code-block";
import { CodeBox } from "./code-box";

const code = `
import strawberry

@strawberry.type
class User:
    name: str
    age: int

@strawberry.type
class Query:
    @strawberry.field
    def user(self) -> User:
        return User(name="Patrick", age=100)

schema = strawberry.Schema(query=Query)
`.trim();

export const Hero = () => {
  return (
    <div className="grid md:grid-cols-2 max-w-7xl mx-auto">
      <div className="m-12">
        <h1 className="inline text-3xl lg:text-5xl lg:leading-relaxed heading-underline bg-gradient-to-r from-red-500 to-red-500">
          Strawberry is a new GraphQL library for Python 3, inspired by
          dataclasses.
        </h1>
      </div>
      <CodeBox>
        <CodeBlock language="python">{code}</CodeBlock>
      </CodeBox>
    </div>
  );
};
