import { CLICommand } from "@shared";
import { CLI_ADD } from "./creator.add.cli";
import { creatorDevCLI } from "./creator.dev.cli";
import { creatorPublishCLI } from "./creator.publish.cli";
import { CLI_PULL } from "./creator.pull.cli";

export function creatorCLI() {
	const cli = new CLICommand(
		"wc-creator",
		"Web Components Creator CLI",
		"1.0.0",
	);

	cli.addCLICommand(creatorDevCLI());

	cli.addCLICommand(CLI_PULL());
	cli.addCLICommand(CLI_ADD());

	cli.addCLICommand(creatorPublishCLI());

	cli.run();
}
