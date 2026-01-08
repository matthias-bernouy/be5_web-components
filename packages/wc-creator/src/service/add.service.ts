import { fileExists, readJsonFromFile, writeToFile } from "@shared";
import { Config } from "../core/object/Config";
import { pullComponent } from "./pull.service";

/**
 * Add a component to a project by its URN.
 * It add the component to the cache if not already present.
 * It add the tagName to the project's component list. (resolve.json)
 */
export async function addComponent(urn: string, tag: string) {
	await Config.initialize();
	await pullComponent(urn);

	if (!(await fileExists(Config.resolveConfigPath))) {
		await writeToFile(Config.resolveConfigPath, JSON.stringify({}, null, 2));
	}
	const lastResolve = await readJsonFromFile(Config.resolveConfigPath);
	lastResolve[tag] = urn;
	await writeToFile(
		Config.resolveConfigPath,
		JSON.stringify(lastResolve, null, 2),
	);
}
