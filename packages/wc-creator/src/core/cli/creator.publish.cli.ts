import { CLICommand, readBlobFromFile } from "@shared";
import { joinPath } from "packages/wc-shared/src/lib/path";
import { postArchiveComponent } from "../fetch/postArchiveComponent";
import { loadComponents } from "../loader/loadComponents";
import { Config } from "../object/Config";

export function creatorPublishCLI(): CLICommand {
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
		Config.initialize();
		const components = await loadComponents();
		if (!components[urn]) {
			throw new Error(
				`Component with URN ${urn} not found in the current working directory`,
			);
		}
		const componentPath = components[urn].getPath();
		await components[urn].createArchive();

		const fileToPublish = readBlobFromFile(
			joinPath(Config.cwd, componentPath, "archive.tar.gz"),
		);

		const isPublished = await postArchiveComponent(fileToPublish);
		if (isPublished) {
			console.info(`Component ${urn} published successfully.`);
		} else {
			console.error(`Failed to publish component ${urn}.`);
		}
	});

	return cli;
}
