import type { ComponentURNType } from "src/types/urn";

export function urnToFolderName(urn: ComponentURNType): string {
	return `${urn.namespace}_${urn.tag}_${urn.version}`;
}
