import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const readmePath = path.join(__dirname, 'src/content/docs/README.mdx');
const content = fs.readFileSync(readmePath, 'utf-8');

// Parse the README to extract sidebar structure
const lines = content.split('\n');
const sidebar = [];
let currentGroup = null;

for (const line of lines) {
  // Skip frontmatter
  if (line.startsWith('---')) continue;

  // Group heading (## Title)
  const groupMatch = line.match(/^## (.+)$/);
  if (groupMatch) {
    currentGroup = {
      label: groupMatch[1],
      items: []
    };
    sidebar.push(currentGroup);
    continue;
  }

  // Top-level link without a group
  const topLevelLinkMatch = line.match(/^- \[(.+?)\]\((.+?)\)$/);
  if (topLevelLinkMatch && !currentGroup) {
    const [, label, link] = topLevelLinkMatch;
    sidebar.push({
      label,
      link: link.replace(/\.mdx?$/, '').replace(/^\.\//, '')
    });
    continue;
  }

  // Link within a group (- [Title](link))
  const linkMatch = line.match(/^- \[(.+?)\]\((.+?)\)$/);
  if (linkMatch && currentGroup) {
    const [, label, link] = linkMatch;
    currentGroup.items.push({
      label,
      link: link.replace(/\.mdx?$/, '').replace(/^\.\//, '')
    });
    continue;
  }

  // Nested link (  - [Title](link))
  const nestedLinkMatch = line.match(/^  - \[(.+?)\]\((.+?)\)$/);
  if (nestedLinkMatch && currentGroup && currentGroup.items.length > 0) {
    const [, label, link] = nestedLinkMatch;
    const lastItem = currentGroup.items[currentGroup.items.length - 1];

    // Convert last item to a group if it isn't already
    if (!lastItem.items) {
      const lastItemLabel = lastItem.label;
      const lastItemLink = lastItem.link;
      currentGroup.items[currentGroup.items.length - 1] = {
        label: lastItemLabel,
        items: [
          { label: lastItemLabel, link: lastItemLink }
        ]
      };
    }

    currentGroup.items[currentGroup.items.length - 1].items.push({
      label,
      link: link.replace(/\.mdx?$/, '').replace(/^\.\//, '')
    });
  }
}

// Generate the config file
const configContent = `// Auto-generated from README.mdx - do not edit manually
// Run: node generate-sidebar.js to regenerate

export const sidebar = ${JSON.stringify(sidebar, null, 2)};
`;

fs.writeFileSync(
  path.join(__dirname, 'sidebar.config.js'),
  configContent
);

console.log('Sidebar configuration generated successfully!');
