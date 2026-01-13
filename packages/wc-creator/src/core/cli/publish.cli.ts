import { CLICommand } from "@shared/cli";
import { publishService } from "../../service/publish.service";

export function CLI_PUBLISH(): CLICommand {
	const cli = new CLICommand("publish");

	cli.addArgument("urn", "Component URN to publish (ex: ns/tag@version)", true);
	cli.addOption("cwd", "Current working directory for the import command");
	cli.addOption("repository", "Repository URL to fetch the component from");

	cli.addAction(async (args: Record<string, string>) => {
		const urn = args.urn;
		if (!urn) {
			throw new Error("URN argument is required for publish command");
		}
		if (args.repository) {
			process.env.REPOSITORY = args.repository;
		}
		if (args.cwd) {
			process.env.CWD = args.cwd;
		}

		await publishService(urn);
	});

	return cli;
}
