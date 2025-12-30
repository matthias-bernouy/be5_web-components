import { CONFIG } from "@/data/local/config.local.data";

export async function resolveFileExists() {
    return await Bun.file(CONFIG.components.resolveFile).exists();
}

export async function readResolveFileContentJson() {
    const resolveFile = Bun.file(CONFIG.components.resolveFile);
    return await resolveFile.json();
}

export async function writeResolveFileContentJson(content: any) {
    await Bun.write(CONFIG.components.resolveFile, JSON.stringify(content, null, 2));
}