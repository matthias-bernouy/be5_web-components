import path from 'node:path';

async function getConfig() {
    const WORK_DIR = path.resolve(process.env.W13C_WORK_DIR || process.cwd());
    
    const configPath = path.join(WORK_DIR, process.env.W13C_CONFIG_PATH || "w13c.config.json");
    const configFile = Bun.file(configPath);

    const data: any = (await configFile.exists()) 
        ? await configFile.json() 
        : {};

    return {
        website: {
            404: path.resolve(WORK_DIR, data.website?.["404"] ?? "website/e/404.html"),
            output: path.resolve(WORK_DIR, data.website?.output ?? ".dist/"),
            source: path.resolve(WORK_DIR, data.website?.source ?? "website/"),
            port: data.website?.port ?? 8080
        },
        components: {
            prefix: data.components?.prefix ?? "w13c-",
            external: path.resolve(WORK_DIR, data.components?.external ?? "components/dist/"),
            local: path.resolve(WORK_DIR, data.components?.local ?? "components/local"),
            output: path.resolve(WORK_DIR, data.components?.output ?? ".dist/bundle.js"),
            resolveFile: path.resolve(WORK_DIR, data.components?.resolveFile ?? "resolve.json"),
            repository: data.components?.repository ?? "https://cdn.web-components.fr"
        },
        workDir: WORK_DIR
    };
}

export { getConfig };