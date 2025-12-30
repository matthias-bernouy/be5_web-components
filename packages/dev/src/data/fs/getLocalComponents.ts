import { readdir } from "node:fs/promises";
import path from "node:path";

export async function getLocalComponents(dir: string) {
    return await fnRec(dir);
}

async function fnRec (dir: string): Promise<string[]>{
    if (await Bun.file(path.join(dir, 'manifest.json')).exists()) {
        return [dir];
    }
    const entries = await readdir(dir, { withFileTypes: true });
    const tasks = entries
        .filter(entry => entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules')
        .map(entry => fnRec(path.join(dir, entry.name)));

    const results = await Promise.all(tasks);
    return results.flat();
};