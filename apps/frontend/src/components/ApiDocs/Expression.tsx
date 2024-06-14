// using react because it is much easier to handle whitespace
const simplifyAnnotated = (expr: any) => {
  console.log(expr);
  return expr.slice.elements[0];
};

const Expression = ({ expr }: { expr: any }) => {
  if (!expr) {
    return null;
  }

  if (typeof expr === "string") {
    return expr;
  }

  if (expr.cls === "ExprSubscript" && expr.left.name === "Annotated") {
    expr = simplifyAnnotated(expr);
  }

  if (expr.cls === "ExprName") {
    return expr.name;
  }

  if (expr.cls === "ExprTuple") {
    return (
      <>
        {!expr.implicit && "("}
        {expr.elements.map((element: any, index: number) => (
          <>
            <Expression expr={element} />
            {index < expr.elements.length - 1 && ", "}
          </>
        ))}
        {!expr.implicit && ")"}
      </>
    );
  }

  if (expr.cls === "ExprSubscript") {
    return (
      <>
        <Expression expr={expr.left} />
        [<Expression expr={expr.slice} />]
      </>
    );
  }

  if (expr.cls === "ExprCall") {
    return (
      <>
        <Expression expr={expr.function} />(
        {expr.arguments.map((arg: any, index: number) => (
          <>
            <Expression expr={arg} />
            {index < expr.arguments.length - 1 && ", "}
          </>
        ))}
        )
      </>
    );
  }

  return null;
};

export default Expression;
