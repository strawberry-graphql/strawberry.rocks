#!/usr/bin/env node

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';
import { writeFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CONTENT_DIR = join(__dirname, 'src/content/docs');

// Parse markdown to extract sidebar structure
function parseReadme(content, baseDir) {
  const lines = content.split('\n');
  const sections = [];
  let currentSection = null;

  for (const line of lines) {
    // Match h2 headings (## Section Name)
    const h2Match = line.match(/^##\s+(.+)$/);
    if (h2Match) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        label: h2Match[1].trim(),
        items: []
      };
      continue;
    }

    // Match list items with links (- [Title](./path))
    const linkMatch = line.match(/^-\s+\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch && currentSection) {
      const title = linkMatch[1].trim();
      let href = linkMatch[2].trim();

      // Convert relative paths to slugs
      // Remove leading './', '.md', '.mdx'
      href = href.replace(/^\.\//, '').replace(/\.mdx?$/, '');

      // Handle special case where link is just '.' (current directory/index)
      if (href === '.' || href === '') {
        href = baseDir === 'strawberry' ? '' : baseDir;
      } else {
        href = baseDir === 'strawberry' ? href : `${baseDir}/${href}`;
      }

      currentSection.items.push({
        label: title,
        slug: `docs/${href}`
      });
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  return sections;
}

// Get all .mdx files in a directory recursively
function getAllMdxFiles(dir, baseDir = '') {
  const files = [];
  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      const subFiles = getAllMdxFiles(fullPath, join(baseDir, entry));
      files.push(...subFiles);
    } else if (entry.endsWith('.mdx') && entry !== 'README.mdx') {
      const relativePath = join(baseDir, entry.replace('.mdx', ''));
      files.push(relativePath);
    }
  }

  return files;
}

// Get the slug from a file path
function filePathToSlug(filePath, docsType) {
  // Remove index from paths
  let slug = filePath.replace(/\/index$/, '').replace(/^\//, '');

  if (docsType === 'strawberry') {
    // For strawberry, the generateId in content.config.ts strips 'strawberry/' and adds 'docs/'
    // So strawberry/breaking-changes/0.146.0 -> docs/breaking-changes/0.146.0
    return slug ? `docs/${slug}` : 'docs';
  } else {
    // For django, it keeps django/ in the path
    // So django/guide/types -> docs/django/guide/types
    return slug ? `docs/${docsType}/${slug}` : `docs/${docsType}`;
  }
}

// Get title from MDX file frontmatter or filename
function getTitleFromFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

    if (frontmatterMatch) {
      const frontmatter = frontmatterMatch[1];
      const titleMatch = frontmatter.match(/title:\s*(.+)/);
      if (titleMatch) {
        return titleMatch[1].trim().replace(/^["']|["']$/g, '');
      }
    }
  } catch (e) {
    // Ignore errors
  }

  // Fallback to filename
  const filename = filePath.split('/').pop().replace('.mdx', '');
  return filename.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

// Generate sidebar for a specific docs section
function generateSidebarForSection(docsType) {
  const sectionDir = join(CONTENT_DIR, docsType);
  const readmePath = join(sectionDir, 'README.mdx');

  let sidebar = [];
  let referencedSlugs = new Set();

  // Parse README if it exists
  if (readmePath) {
    try {
      const readmeContent = readFileSync(readmePath, 'utf-8');
      sidebar = parseReadme(readmeContent, docsType);

      // Collect all referenced slugs
      for (const section of sidebar) {
        for (const item of section.items) {
          referencedSlugs.add(item.slug);
        }
      }
    } catch (e) {
      console.warn(`Warning: Could not read README for ${docsType}:`, e.message);
    }
  }

  // Find all .mdx files
  const allFiles = getAllMdxFiles(sectionDir);
  const unreferencedFiles = [];

  for (const file of allFiles) {
    const slug = filePathToSlug(file, docsType);

    // Skip index file if it's the main one
    if (slug === 'docs' && docsType === 'strawberry') continue;
    if (slug === `docs/${docsType}` && docsType === 'django') continue;

    if (!referencedSlugs.has(slug)) {
      const fullPath = join(sectionDir, `${file}.mdx`);
      const title = getTitleFromFile(fullPath);
      unreferencedFiles.push({ label: title, slug });
    }
  }

  // Add unreferenced files to sidebar
  if (unreferencedFiles.length > 0) {
    sidebar.push({
      label: 'Other',
      items: unreferencedFiles.sort((a, b) => a.label.localeCompare(b.label))
    });
  }

  return sidebar;
}

// Main execution
function main() {
  console.log('Generating sidebar configuration...');

  const strawberrySidebar = generateSidebarForSection('strawberry');
  const djangoSidebar = generateSidebarForSection('django');

  const config = {
    strawberry: strawberrySidebar,
    django: djangoSidebar
  };

  // Output as ES module
  const outputPath = join(__dirname, 'sidebar.generated.mjs');
  const output = `// Auto-generated sidebar configuration
// Generated by generate-sidebar.mjs
// Do not edit this file manually

export const strawberrySidebar = ${JSON.stringify(config.strawberry, null, 2)};

export const djangoSidebar = ${JSON.stringify(config.django, null, 2)};
`;

  writeFileSync(outputPath, output, 'utf-8');
  console.log('✅ Sidebar configuration written to sidebar.generated.mjs');
  console.log(`   - Strawberry: ${strawberrySidebar.length} sections`);
  console.log(`   - Django: ${djangoSidebar.length} sections`);
}

main();
