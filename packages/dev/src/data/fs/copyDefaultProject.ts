import path from "node:path";
import { cp } from "node:fs/promises";

export async function copyDefaultProjectStructure(workDir: string) {
    await cp(path.resolve(__dirname, "../resources/project"), workDir, {
        recursive: true,
        force: true
    });
}