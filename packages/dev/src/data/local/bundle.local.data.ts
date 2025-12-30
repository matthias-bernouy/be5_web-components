import { CONFIG } from "@/data/local/config.local.data";
import { mkdir } from "node:fs/promises";
import path from "node:path";

export async function writeBundleFile(content: string) {
    await mkdir(path.dirname(CONFIG.directories.outputBundle), { recursive: true });
    await Bun.write(CONFIG.directories.outputBundle, content);
}