const simplifyAnnotated = (expr: any) => {
  return expr.slice.elements[0];
};

const unionToBinOp = (expr: any): any => {
  const elements = expr.slice.elements;

  if (elements.length === 1) {
    return elements[0];
  }

  return {
    cls: "ExprBinOp",
    left: elements[0],
    operator: "|",
    right: unionToBinOp({
      cls: "Union",
      slice: {
        cls: "Slice",
        elements: elements.slice(1),
      },
    }),
  };
};

const parseSubscript = (expr: any) => {
  if (expr.left.name === "Annotated") {
    expr = simplifyAnnotated(expr);
  }

  if (expr.left.name === "Optional") {
    expr = {
      cls: "ExprBinOp",
      left: expr.slice,
      operator: "|",
      right: "None",
    };
  }

  if (expr.left.name === "Union") {
    expr = unionToBinOp(expr);
  }

  return expr;
};

function expressionToString(expr: any): string {
  if (!expr) {
    return "";
  }

  if (typeof expr === "string") {
    return expr;
  }

  if (expr.cls === "ExprSubscript") {
    expr = parseSubscript(expr);
  }

  if (expr.cls === "ExprName") {
    return expr.name;
  }

  if (expr.cls === "ExprBinOp") {
    return `${expressionToString(expr.left)} ${
      expr.operator
    } ${expressionToString(expr.right)}`;
  }

  if (expr.cls === "ExprTuple") {
    let content = expr.elements.map(expressionToString).join(", ");

    if (!expr.implicit) {
      content = `(${content})`;
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

  if (expr.cls === "ExprList") {
    return `[${expr.elements.map(expressionToString).join(", ")}]`;
  }

  if (expr.cls === "ExprAttribute") {
    return expr.values.map(expressionToString).join(".");
  }

  return expr.cls;
}

export default expressionToString;
