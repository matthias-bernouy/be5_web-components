import { c, x } from "tar";
import { mkdir } from "./file";
import { dirnamePath } from "./path";

export function extractAllFilesFromTar(input: string, output: string) {
	mkdir(dirnamePath(output));
	x({
		file: input,
		cwd: output,
		sync: true,
	});
}

export function createTar(input: string, output: string) {
	mkdir(dirnamePath(output));
	c(
		{
			file: output,
			cwd: input,
			sync: true,
		},
		[""],
	);
}
