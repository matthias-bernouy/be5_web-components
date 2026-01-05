import { type Argument, Command } from "commander";

export class CLICommand {
	private program: Command;

	constructor(name: string) {
		this.program = new Command(name);
	}

	addArgument(
		argument: string,
		description: string,
		required: boolean = false,
		_opts: null = null,
	): CLICommand {
		if (required) {
			this.program.argument(`<${argument}>`, description);
		} else {
			this.program.argument(`[${argument}]`, description);
		}
		return this;
	}

	addOption(
		option: string,
		description: string,
		_opts: null = null,
	): CLICommand {
		this.program.option(`--${option} <value>`, description);
		return this;
	}

	addAction(action: (args: Record<string, string>) => void): CLICommand {
		this.program.action(() => {
			let ret: Record<string, string> = {};
			for (let i = 0; i < this.program.registeredArguments.length; i++) {
				const arg = this.program.registeredArguments[i] as Argument;
				const name = arg
					.name()
					.replaceAll("<", "")
					.replaceAll(">", "")
					.replaceAll("[", "")
					.replaceAll("]", "");
				ret[name] = this.program.args[i] as string;
			}
			ret = { ...ret, ...this.program.opts() };
			action(ret);
		});
		return this;
	}

	addCLICommand(command: CLICommand): CLICommand {
		this.program.addCommand(command.program);
		return this;
	}

	run() {
		this.program.parse();
	}
}
