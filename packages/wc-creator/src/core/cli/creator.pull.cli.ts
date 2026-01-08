import {
	CLICommand,
	extractAllFilesFromTar,
	parseURN,
	writeToFile,
} from "@shared";
import { joinPath } from "packages/wc-shared/src/lib/path";
import { pullComponent } from "../../service/pull.service";
import { getArchiveComponent } from "../fetch/getArchiveComponent";
import { Config } from "../object/Config";

export function creatorImportCLI(): CLICommand {
	const cli = new CLICommand("pull");

	cli.addArgument(
		"urn",
		"URN of the import command (ex: ns/tag@version)",
		true,
	);
	cli.addOption("repository", "Repository URL to fetch the component from");

	cli.addAction(async (args: Record<string, string>) => {
		if (args.urn === undefined) {
			throw new Error("URN argument is required for import command");
		}
		if (args.repository) {
			process.env.REPOSITORY = args.repository;
		}
		await pullComponent(args.urn);
	});

	return cli;
}
