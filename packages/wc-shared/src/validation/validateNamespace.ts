export function validateNamespace(namespace: string): boolean {
	const namespaceRegex = /^[a-z0-9][a-z0-9-]*$/;
	return namespaceRegex.test(namespace);
}
