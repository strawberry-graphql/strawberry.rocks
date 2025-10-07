import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { getContentEntryIdAndSlug } from 'node_modules/astro/dist/content/utils';

export const collections = {
	docs: defineCollection({
		loader: docsLoader({
		generateId: ({entry, base }) => {
			// Get the file path relative to the base
			const entryURL = new URL(encodeURI(entry), base);
			let relativePath = entryURL.pathname.replace(base.pathname, '');

			// Remove leading slash and .mdx extension
			relativePath = relativePath.replace(/^\//, '').replace(/\.mdx$/, '');

			if (relativePath === 'strawberry' || relativePath === 'strawberry/index') {
				return 'docs';
			}

			// Remove strawberry/ prefix
			let slug = relativePath.replace(/^strawberry\//, '');

			// Remove /index suffix to make integrations/index -> integrations
			slug = slug.replace(/\/index$/, '');

			return `docs/${slug}`;
		}
		}),
		schema: docsSchema({
			extend: (context) => context.schema,
		}),
	}),
};
