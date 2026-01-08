import { dirname, resolve } from "@shared";

export class Config {

    static cwd: string = "";
    static cwdModule: string = "";
    static cdnPath: string = "";

    static initialize(){
        Config.cwdModule = resolve(
			dirname(import.meta.url.replace("file://", "")),
			"../../",
		);
        Config.cwd = process.cwd();
        Config.cdnPath = process.env.CDN_PATH || resolve(Config.cwdModule, "cdn");
    }
}