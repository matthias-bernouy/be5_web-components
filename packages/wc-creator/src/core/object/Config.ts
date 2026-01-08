import { dirname, join, resolve } from "@shared";

export class Config {
	public static port: number;
	public static repository: string;
	public static cwd: string;
	public static cwd_module: string;
	public static cachePath: string;
	public static resolveConfigPath: string;

	static async initialize() {
		if (process.env.CREATOR_PORT === undefined) {
			Config.port = 8080;
		} else {
			Config.port = parseInt(process.env.CREATOR_PORT, 10);
		}

		Config.cachePath = join(process.env.HOME || "", ".cache", "web-components");
		Config.repository =
			process.env.REPOSITORY_URL ?? "https://cdn.web-components.fr";
		// Prblm CWD, si pas absolute ?
		Config.cwd = resolve(process.env.CWD ?? process.cwd());
		Config.cwd_module = resolve(
			dirname(import.meta.url.replace("file://", "")),
			"../../../",
		);
		Config.resolveConfigPath = join(Config.cwd, "resolve.json");
		return Promise.resolve();
	}

	static toString(): string {
		return `Config:
  - port: ${Config.port}
  - repository: ${Config.repository}
  - cache_path: ${Config.cachePath}
  - cwd: ${Config.cwd}
  - resolve_config_path: ${Config.resolveConfigPath}
  - cwd_module: ${Config.cwd_module}`;
	}
}
