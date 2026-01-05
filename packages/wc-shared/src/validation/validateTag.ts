export function validateTag(tag: string): boolean {
	const tagRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
	return tagRegex.test(tag);
}
