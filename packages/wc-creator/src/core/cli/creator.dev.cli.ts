import { CLICommand } from "@shared";
import { startCreatorDev } from "../../service/dev.service";

export function creatorDevCLI(): CLICommand {
    const cli = new CLICommand("dev");

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

        await startCreatorDev();
    });

    return cli;
}
