import { c, x } from "tar";

export function extractAllFilesFromTar(input: string, output: string) {
	x({
		file: input,
		cwd: output,
		sync: true,
	});
}

export function createTar(input: string, output: string) {
	c(
		{
			file: output,
			cwd: input,
			sync: true,
		},
		[""],
	);
}
