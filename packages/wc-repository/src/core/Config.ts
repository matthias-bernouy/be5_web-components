import { dirname, resolve } from "@shared";

export class Config {
	static cwd: string = "";
	static cwdModule: string = "";
	static dataPath: string = "";
	static port = 8080;

	static initialize() {
		Config.cwdModule = resolve(
			dirname(import.meta.url.replace("file://", "")),
			"../../",
		);
		Config.cwd = process.cwd();
		Config.dataPath =
			process.env.DATA_PATH || resolve(Config.cwdModule, "component");
		Config.port = process.env.API_PORT
			? parseInt(process.env.API_PORT, 10)
			: 8080;
		console.log("Config initialized:");
		console.log(`- cwdModule: ${Config.cwdModule}`);
		console.log(`- cwd: ${Config.cwd}`);
		console.log(`- dataPath: ${Config.dataPath}`);
		console.log(`- port: ${Config.port}`);
	}
}
