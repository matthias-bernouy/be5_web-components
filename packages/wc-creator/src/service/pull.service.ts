import {
	extractAllFilesFromTar,
	fileExists,
	join,
	mkdir,
	parseURN,
	urnToFolderName,
	writeToFile,
} from "@shared";
import { getArchiveComponent } from "../core/fetch/getArchiveComponent";
import { Config } from "../core/object/Config";

export async function pullComponent(urn: string) {
	await Config.initialize();
	const urnParts = parseURN(urn);
	if (!urnParts) {
		throw new Error(`Invalid URN format: ${urn}`);
	}

	const folderName = urnToFolderName(urnParts);
	const folderPath = join(Config.cachePath, folderName);

	mkdir(folderPath);
	if (!(await fileExists(join(folderPath, "archive.tar.gz")))) {
		const archive = await getArchiveComponent(urnParts);
		await writeToFile(join(folderPath, `archive.tar.gz`), archive);
		extractAllFilesFromTar(join(folderPath, `archive.tar.gz`), folderPath);
		console.info(`Component downloaded and cached at: ${folderPath}`);
	} else {
		console.info(`Component found in cache at: ${folderPath}`);
	}
}
