import { CLICommand } from "@shared";

export function creatorPublishCLI(): CLICommand {
	const cli = new CLICommand("publish");

	return cli;
}
