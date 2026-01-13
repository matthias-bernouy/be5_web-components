import { CLICommand } from "@shared/cli";
import { addComponent } from "../../service/add.service";

export function CLI_ADD(): CLICommand {
	const cli = new CLICommand("add");

	cli.addArgument(
		"urn",
		"URN of the import command (ex: ns/tag@version)",
		true,
	);

	cli.addOption("repository", "Repository URL to fetch the component from");
	cli.addOption("tag", "Tag name to assign to the added component");
	cli.addOption("cwd", "Current working directory for the import command");

	cli.addAction(async (args: Record<string, string>) => {
		if (args.urn === undefined) {
			throw new Error("URN argument is required for import command");
		}
		if (args.repository) {
			process.env.REPOSITORY = args.repository;
		}
		if (args.cwd) {
			process.env.CWD = args.cwd;
		}
		if (!args.tag) {
			throw new Error("Tag option is required for add command");
		}
		await addComponent(args.urn, args.tag);
	});

	return cli;
}
