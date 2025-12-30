import { copyDefaultProjectStructure } from "@/data/local/resources.local.data";

export async function initService(workDir: string) {

    await copyDefaultProjectStructure(workDir);

}