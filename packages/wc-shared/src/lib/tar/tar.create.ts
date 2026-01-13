import { c } from "tar";
import { mkdir } from "../file";
import { dirnamePath } from "../path";

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
