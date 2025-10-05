import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { getContentEntryIdAndSlug } from 'node_modules/astro/dist/content/utils';

export const collections = {
	docs: defineCollection({
		loader: docsLoader({
		generateId: ({entry, base }) => {
		const entryURL = new URL(encodeURI(entry), base);
			let { slug } = getContentEntryIdAndSlug({
				entry: entryURL,
				contentDir: base,
				collection: '',
			});


			if (slug === 'strawberry') {
			return 'docs'
			}

			slug = slug.replace(/^strawberry\//, '')


			return `docs/${slug}`;
		}
		}),
		schema: docsSchema({
			extend: (context) => context.schema,
		}),
	}),
};
