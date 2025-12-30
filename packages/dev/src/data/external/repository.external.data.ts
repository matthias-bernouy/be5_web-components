import { CONFIG } from "@/data/local/config.local.data";
import path from "node:path";
import type { packageURNDestructured } from "types/packageURN.type";

export async function getPackageFromRepository(urn: packageURNDestructured) {
    const { namespace, componentName: name, version } = urn;
    const url = path.join(CONFIG.repository, namespace, name, version, 'package.tar.gz');
    const fetchResult = await fetch(url);
    return await fetchResult.text();
}