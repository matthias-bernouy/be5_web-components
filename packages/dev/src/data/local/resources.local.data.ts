import { CONFIG } from "@/data/local/config.local.data";
import { cp } from "node:fs/promises";
import path from "node:path";

export async function copyDefaultProjectStructure(workDir: string) {
    try {
        await cp(path.resolve(__dirname, "../resources/project"), workDir, {
            recursive: true,
            force: true
        });
    } catch (err) {
        console.error("Copy failed:", err);
    }
}

export async function copyDefaultComponent(name: string) {
    try {
        await cp(path.resolve(__dirname, "../resources/component"), path.join(CONFIG.components.localFolder, name), {
            recursive: true,
            force: true
        });
    } catch (err) {
        console.error("Copy failed:", err);
    }
}