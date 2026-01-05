export function validateURN(urn: string): boolean {
	const urnRegex =
		/^([a-z0-9][a-z0-9-]*)\/([a-z0-9]+(-[a-z0-9]+)+)@(\d+\.\d+\.\d+)$/;
	return urnRegex.test(urn);
}
