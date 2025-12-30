import path from 'node:path';

// Utilisation d'une interface pour un meilleur typage
interface Config {
    workDir: string;
    website: {
        404: string;
        source: string;
        output: string;
        port: number
    },
    components: {
        prefix: string;
        distFolder: string;
        localFolder: string;
        output: string;
        resolveFile: string;
        repository: string;
    }
}

let CONFIG: Config;

async function initConfig() {
    const WORK_DIR = path.resolve(process.env.W13C_WORK_DIR || process.cwd());
    
    const configPath = path.resolve(WORK_DIR, process.env.W13C_CONFIG_PATH || "w13c.config.json");
    const configFile = Bun.file(configPath);

    const data = (await configFile.exists()) 
        ? await configFile.json() 
        : {};

    CONFIG = {
        website: {
            404: path.resolve(WORK_DIR, data.website?.["404"] ?? "website/e/404.html"),
            output: path.resolve(WORK_DIR, data.website?.output ?? ".dist/"),
            source: path.resolve(WORK_DIR, data.website?.source ?? "website/"),
            port: data.website?.port ?? 80
        },
        components: {
            prefix: data.components?.prefix ?? "w13c-",
            distFolder: path.resolve(WORK_DIR, data.components?.distFolder ?? "components/dist/"),
            localFolder: path.resolve(WORK_DIR, data.components?.localFolder ?? "components/local"),
            output: path.resolve(WORK_DIR, data.components?.output ?? ".dist/bundle.js"),
            resolveFile: path.resolve(WORK_DIR, data.components?.resolveFile ?? "resolve.json"),
            repository: data.components?.repository ?? "https://cdn.web-components.fr"
        },
        workDir: WORK_DIR
    };
}

export { initConfig, CONFIG };