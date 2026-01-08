import { fileExists, readBlobFromFile } from "@shared";
import { Config } from "../core/Config";

export async function CDN(req: HTTPRequest): Promise<Response> {
	const path = req.path.replace("/cdn/", "");
	if ( !await fileExists(`${Config.cdnPath}/${path}`)) {
		return new Response("File not found", { status: 404 });
	}
	return new Response(readBlobFromFile(`${Config.cdnPath}/${path}`));
}
