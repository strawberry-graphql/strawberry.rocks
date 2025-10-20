import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export function baseOptions(): BaseLayoutProps {
	return {
		// Disable nav header for docs
		// see https://fumadocs.dev/docs/ui/navigation/links
		links: [
			{
				text: "LOL",
				url: "/",
			},
		],
	};
}
