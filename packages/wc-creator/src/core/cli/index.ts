import { CLICommand } from "@shared";
import { creatorDevCLI } from "./creator.dev.cli";
import { creatorImportCLI } from "./creator.pull.cli";
import { creatorPublishCLI } from "./creator.publish.cli";

export function creatorCLI() {
	const cli = new CLICommand(
		"wc-creator",
		"Web Components Creator CLI",
		"1.0.0",
	);

	cli.addCLICommand(creatorDevCLI());
	cli.addCLICommand(creatorImportCLI());
	cli.addCLICommand(creatorPublishCLI());

	cli.run();
}
