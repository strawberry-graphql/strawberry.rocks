import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { Note, Tip, Warning, CodeNotes, CodeGrid } from './components/callouts';
import { ExtensionsList } from './components/extensions-list';

// use this function to get MDX components, you will need it for rendering MDX
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Note,
    Tip,
    Warning,
    CodeNotes,
    CodeGrid,
    ExtensionsList,
    ...components,
  };
}
