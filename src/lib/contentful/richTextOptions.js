/**
 * Shared Contentful rich text renderer options.
 * Used by all components that call documentToHtmlString.
 *
 * Custom renderers are limited to cases where the default output needs
 * structural changes (e.g. table overflow wrapper). Styling is handled
 * entirely by .prose CSS in app.css.
 *
 * @type {import('@contentful/rich-text-html-renderer').Options}
 */
export const richTextOptions = {
	renderNode: {
		/**
		 * Wrap tables in a scrollable container so they don't overflow on small screens.
		 * The default renderer emits bare <table> with no wrapper.
		 *
		 * @param {any} node
		 * @param {function} next
		 * @returns {string}
		 */
		table: (node, next) =>
			`<div class="prose-table-wrapper"><table>${next(node.content)}</table></div>`
	}
};
