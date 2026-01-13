import { join, readBlobFromFile } from "@shared";
import { postArchiveComponent } from "../core/fetch/postArchiveComponent";
import { loadComponents } from "../core/loader/loadComponents";
import { Config } from "../core/object/Config";

export async function publishService(urn: string) {
	Config.initialize();
	const components = await loadComponents();
	if (!components[urn]) {
		throw new Error(
			`Component with URN ${urn} not found in the current working directory`,
		);
	}
	const componentPath = components[urn].getPath();
	await components[urn].createArchive();

	const fileToPublish = readBlobFromFile(
		join(Config.cwd, componentPath, "archive.tar.gz"),
	);

	const isPublished = await postArchiveComponent(fileToPublish);
	if (isPublished) {
		console.info(`Component ${urn} published successfully.`);
	} else {
		console.error(`Failed to publish component ${urn}.`);
	}
}
