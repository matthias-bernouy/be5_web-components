import { joinPath } from "packages/wc-shared/src/lib/path";
import { Config } from "../object/Config";

export async function postArchiveComponent(file: Blob): Promise<boolean> {
	const data = await fetch(joinPath(Config.repository, "component"), {
		method: "POST",
		body: file,
	});

	console.log(await data.text());

	return data.ok;
}
