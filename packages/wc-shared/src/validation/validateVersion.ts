export function validateVersion(version: string): boolean {
	const versionRegex = /^\d+\.\d+\.\d+$/;
	return versionRegex.test(version);
}
