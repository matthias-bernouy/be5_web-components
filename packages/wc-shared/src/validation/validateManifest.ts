import type { ManifestType } from "../types/manifest";
import { validateNamespace } from "./validateNamespace";
import { validateTag } from "./validateTag";
import { validateVersion } from "./validateVersion";

export function validateManifest(data: ManifestType) {
	if (!data) return false;
	if (typeof data !== "object") return false;
	if (!validateNamespace(data.namespace)) {
		console.error("Invalid namespace:", data.namespace);
		return false;
	}
	if (!validateTag(data.tag)) {
		console.error("Invalid tag:", data.tag);
		return false;
	}
	if (!validateVersion(data.version)) {
		console.error("Invalid version:", data.version);
		return false;
	}
	if (typeof data.htmlFile !== "string" || data.htmlFile.trim() === "") {
		console.error("Invalid htmlFile:", data.htmlFile);
		return false;
	}
	if (typeof data.cssFile !== "string" || data.cssFile.trim() === "") {
		console.error("Invalid cssFile:", data.cssFile);
		return false;
	}
	if (typeof data.jsFile !== "string" || data.jsFile.trim() === "") {
		console.error("Invalid jsFile:", data.jsFile);
		return false;
	}
	if (typeof data.previewFile !== "string" || data.previewFile.trim() === "") {
		console.error("Invalid previewFile:", data.previewFile);
		return false;
	}
	return true;
}
