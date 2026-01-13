import { CLICommand } from "@shared/cli";
import { CLI_ADD } from "./add.cli";
import { CLI_DEV } from "./dev.cli";
import { CLI_PUBLISH } from "./publish.cli";
import { CLI_PULL } from "./pull.cli";

export function creatorCLI() {
	const cli = new CLICommand(
		"wc-creator",
		"Web Components Creator CLI",
		"1.0.0",
	);

	cli.addCLICommand(CLI_DEV());

	cli.addCLICommand(CLI_PULL());
	cli.addCLICommand(CLI_ADD());
	cli.addCLICommand(CLI_PUBLISH());

	cli.run();
}
