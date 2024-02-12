import markdown from "remark-parse";
import stringify from "remark-stringify";
import { unified } from "unified";
import { visit } from "unist-util-visit";

export const addGitHubLinks = (
  text: string,
  repository = "strawberry-graphql/strawberry"
) => {
  const processor = unified().use(markdown);
  const tree = processor.parse(text);

  visit(tree, "text", (node, index, parent) => {
    const newNodes = [];
    let lastIndex = 0;

    const addLink = (
      regex: RegExp,
      urlFunc: (match: RegExpExecArray) => string
    ) => {
      let match;
      while ((match = regex.exec(node.value)) !== null) {
        // Push text before the match
        if (match.index > lastIndex) {
          newNodes.push({
            type: "text",
            value: node.value.slice(lastIndex, match.index),
          });
        }

        // Push link node
        const url = urlFunc(match);
        newNodes.push({
          type: "link",
          url: url,
          title: null,
          children: [{ type: "text", value: match[0] }],
        });

        lastIndex = regex.lastIndex;
      }
    };

    addLink(/@(\w+)/g, (match) => `https://github.com/${match[1]}`);
    addLink(
      /#(\d+)/g,
      (match) => `https://github.com/${repository}/pull/${match[1]}`
    );

    // Push remaining text
    if (lastIndex < node.value.length) {
      newNodes.push({ type: "text", value: node.value.slice(lastIndex) });
    }

    if (newNodes.length > 0) {
      // @ts-ignore
      parent.children.splice(index, 1, ...newNodes);
    }
  });

  return unified().use(stringify).stringify(tree);
};
