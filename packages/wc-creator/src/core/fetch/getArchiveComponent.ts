import { type ComponentURNType, join } from "@shared";
import { Config } from "../object/Config";

export async function getArchiveComponent(
	urn: ComponentURNType,
): Promise<Uint8Array> {
	const data = await fetch(
		join(
			Config.repository,
			"component",
			urn.namespace,
			urn.tag,
			urn.version,
			"archive.tar.gz",
		),
	);

	if (!data.ok) {
		throw new Error(`Failed to fetch component archive: ${data.status}`);
	}

	return new Uint8Array(await data.arrayBuffer());
}
