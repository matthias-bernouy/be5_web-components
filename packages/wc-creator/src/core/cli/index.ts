import { CLICommand } from "@shared";
import { startCreatorDev } from "../../service/creator.dev.service";

export function creatorCLI(): CLICommand {
	const cli = new CLICommand("wc-creator");

	cli.addArgument("dev", "Start in creator development mode");

	cli.addOption("port", "Port to use for the development server");
	cli.addOption("cwd", "Current working directory for the development server");

	cli.addAction(async (args: Record<string, string>) => {
		if (args.port && Number.isNaN(parseInt(args.port, 10))) {
			console.error(
				`Error: Provided port "${args.port}" is not a valid number.`,
			);
			process.exit(1);
		}

		if (args.port) process.env.PORT = args.port;
		if (args.cwd) process.env.CWD = args.cwd;

		if (args.dev === "dev") {
			await startCreatorDev();
		} else {
			console.log(
				"wc-creator: no valid command provided. Use 'dev' to start in creator development mode.",
			);
		}
	});

	return cli;
}
