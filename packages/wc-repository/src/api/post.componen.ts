import {
	copyDir,
	del,
	extractAllFilesFromTar,
	fileExists,
	type ManifestType,
	mkdir,
	readJsonFromFile,
	replaceFile,
	validateManifest,
	writeToFile,
} from "@shared";
import { Config } from "../core/Config";

export async function POST_Component(req: HTTPRequest): Promise<Response> {
	console.log("NEW REQUEST TO POST_COMPONENT");
	const bodyBytes = await req.body.bytes();
	if (!bodyBytes) {
		return new Response("No body provided", { status: 400 });
	}

	const reqID = crypto.randomUUID();

	await writeToFile(
		`${Config.cwdModule}/tmp/${reqID}/archive.tar.gz`,
		bodyBytes,
	);

	mkdir(`${Config.cwdModule}/tmp/${reqID}/extracted/`);
	extractAllFilesFromTar(
		`${Config.cwdModule}/tmp/${reqID}/archive.tar.gz`,
		`${Config.cwdModule}/tmp/${reqID}/extracted/`,
	);

	if (
		!(await fileExists(
			`${Config.cwdModule}/tmp/${reqID}/extracted/manifest.json`,
		))
	) {
		return new Response("No manifest.json found in archive", { status: 400 });
	}

	const manifestJSON = (await readJsonFromFile(
		`${Config.cwdModule}/tmp/${reqID}/extracted/manifest.json`,
	)) as ManifestType;
	if (!validateManifest(manifestJSON)) {
		return new Response("Invalid manifest.json", { status: 400 });
	}

	if (
		await fileExists(
			`${Config.dataPath}/${manifestJSON.namespace}/${manifestJSON.tag}/${manifestJSON.version}/`,
		)
	) {
		return new Response("Component version already exists", { status: 409 });
	}

	copyDir(
		`${Config.cwdModule}/tmp/${reqID}/extracted/`,
		`${Config.dataPath}/${manifestJSON.namespace}/${manifestJSON.tag}/${manifestJSON.version}/`,
	);

	replaceFile(
		`${Config.cwdModule}/tmp/${reqID}/archive.tar.gz`,
		`${Config.dataPath}/${manifestJSON.namespace}/${manifestJSON.tag}/${manifestJSON.version}/archive.tar.gz`,
	);

	del(`${Config.cwdModule}/tmp/${reqID}/`);
	return new Response("POST_Component response");
}
