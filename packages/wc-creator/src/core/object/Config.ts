import { dirname, resolve } from "@shared";

export class Config {
	public static port: number;
	public static repository: string;
	public static cwd: string;
	public static cwd_module: string;

	static async initialize() {
		if (process.env.PORT === undefined) {
			Config.port = 8080;
		} else {
			Config.port = parseInt(process.env.PORT, 10);
		}
		Config.repository =
			process.env.REPOSITORY ?? "https://cdn.web-components.fr";
		Config.cwd = process.env.CWD ?? process.cwd();
		Config.cwd_module = resolve(
			dirname(import.meta.url.replace("file://", "")),
			"../../../",
		);
		return Promise.resolve();
	}

	static toString(): string {
		return `Config:
  - port: ${Config.port}
  - repository: ${Config.repository}
  - cwd: ${Config.cwd}
  - cwd_module: ${Config.cwd_module}`;
	}
}
