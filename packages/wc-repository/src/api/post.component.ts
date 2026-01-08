import { copyDir, del, extractAllFilesFromTar, fileExists, readJsonFromFile, validateManifest, writeToFile, type ManifestType } from "@shared";

export async function POST_Component(req: HTTPRequest): Promise<Response> {
	const bodyBytes = await req.body.bytes();
	if (!bodyBytes) {
		return new Response("No body provided", { status: 400 });
	}

	const reqID = crypto.randomUUID();

	await writeToFile(`./tmp/${reqID}/archive.tar.gz`, bodyBytes);
	extractAllFilesFromTar(`./tmp/${reqID}/archive.tar.gz`, `./tmp/${reqID}/`);

	if ( !await fileExists(`./tmp/${reqID}/manifest.json`) ) {
		return new Response("No manifest.json found in archive", { status: 400 });
	}

	const manifestJSON = await readJsonFromFile(`./tmp/${reqID}/manifest.json`) as ManifestType;
	if ( !validateManifest(manifestJSON) ) {
		return new Response("Invalid manifest.json", { status: 400 });
	}

	if ( !await fileExists(`./cdn/${manifestJSON.namespace}/${manifestJSON.tag}/${manifestJSON.version}/`) ) {
		return new Response("Component version already exists", { status: 409 });
	}
	
	copyDir(`./tmp/${reqID}/`, `./cdn/${manifestJSON.namespace}/${manifestJSON.tag}/${manifestJSON.version}/`);
	
	del(`./tmp/${reqID}/`);
	return new Response("POST_Component response");
}
