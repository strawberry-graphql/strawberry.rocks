const simplifyAnnotated = (expr: any) => {
  return expr.slice.elements[0];
};

function expressionToString(expr: any): string {
  if (!expr) {
    return "";
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
    let content = "";
    if (!expr.implicit) {
      content += "(";
    }
    content += expr.elements.map(expressionToString).join(", ");
    if (!expr.implicit) {
      content += ")";
    }
    return content;
  }

  if (expr.cls === "ExprSubscript") {
    return `${expressionToString(expr.left)}[${expressionToString(
      expr.slice
    )}]`;
  }

  if (expr.cls === "ExprCall") {
    return `${expressionToString(expr.function)}(${expr.arguments
      .map(expressionToString)
      .join(", ")})`;
  }

  return "";
}

export default expressionToString;
