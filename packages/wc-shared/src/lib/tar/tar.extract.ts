import { extract as x } from "tar/extract";
import { mkdir } from "../file";
import { dirnamePath } from "../path";

export function extractAllFilesFromTar(input: string, output: string) {
	mkdir(dirnamePath(output));
	x({
		file: input,
		cwd: output,
		sync: true,
	});
}
