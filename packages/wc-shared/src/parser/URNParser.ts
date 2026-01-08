import type { ComponentURNType } from "src/types/urn";

export function parseURN(urn: string): ComponentURNType | null {
	const urnPattern =
		/^([a-z0-9][a-z0-9-]{0,31})\/([a-z0-9]+(-[a-z0-9]{0,7}){0,3})@(\d{0,8}\.\d{0,8}\.\d{0,8})$/;
	const match = urn.match(urnPattern);

	if (match) {
		const namespace = match[1] as string;
		const tag = match[2] as string;
		const version = match[4] as string;

		return { namespace, tag, version };
	}
	return null;
}
