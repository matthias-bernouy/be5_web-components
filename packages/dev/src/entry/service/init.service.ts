import { copyDefaultProjectStructure } from "@/data/fs/copyDefaultProject";

export async function initService(workDir: string) {
    await copyDefaultProjectStructure(workDir);
}