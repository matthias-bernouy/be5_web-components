import { fileExists, readBlobFromFile } from "@shared";
import { Config } from "../core/Config";

export async function GET_Component(req: HTTPRequest): Promise<Response> {
	const path = req.path.replace("/component/", "");
	if (!(await fileExists(`${Config.components}/${path}`))) {
		return new Response("File not found", { status: 404 });
	}
	return new Response(readBlobFromFile(`${Config.components}/${path}`));
}
