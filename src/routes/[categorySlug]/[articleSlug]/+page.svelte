<script>
	import BlogPostContent from '$lib/components/BlogPostContent.svelte';

	/**
	 * @type {{ data: { post: any, relatedPosts: Array<any> } }}
	 */
	export let data;
</script>

<BlogPostContent post={data.post} relatedPosts={data.relatedPosts} />
