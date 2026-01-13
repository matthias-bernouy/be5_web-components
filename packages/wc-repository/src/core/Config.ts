import { resolve } from "@shared";

export class Config {
	static cwd: string = "";
	static components: string = "";
	static port = 8080;

	static initialize() {
		Config.cwd = process.cwd();
		Config.components =
			process.env.DATA_PATH ||
			resolve(Config.cwd, "data", "repository", "components");
		Config.port = process.env.API_PORT
			? parseInt(process.env.API_PORT, 10)
			: 8080;
		console.log("Config initialized:");
		console.log(`- cwd:       ${Config.cwd}`);
		console.log(`- components:  ${Config.components}`);
		console.log(`- port:      ${Config.port}`);
	}
}
