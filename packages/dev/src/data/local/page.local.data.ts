import { CONFIG } from "@/data/local/config.local.data";
import { cp } from "node:fs/promises";
import path from "node:path";
import { statSync } from "node:fs";

export async function copyWebsite(){
    try {
        await cp(CONFIG.website.source, CONFIG.website.output, { 
            recursive: true,
            force: true
        });
        } catch (err) {
            console.error("Copy failed:", err);
    }
}

export async function getPageContentFromSource(pagePath: string) {
    const fullPath = path.join(CONFIG.website.source, pagePath);
    const file = Bun.file(fullPath);
    return await file.text();
}

export async function writePageContentToOutput(pagePath: string, content: string) {
    const fullPath = path.join(CONFIG.website.output, pagePath);
    await Bun.write(fullPath, content);
}

export function isPageFile(pagePath: string) {
    try{
        const stat = statSync(path.join(CONFIG.website.source, pagePath));
        return stat.isFile();
    } catch{
        return false;
    }
}