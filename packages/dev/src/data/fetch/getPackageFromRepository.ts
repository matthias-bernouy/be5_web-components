import path from "node:path";
import type { packageURNDestructured } from "types/packageURN.type";

export async function getPackageFromRepository(urn: packageURNDestructured, repositoryURL: string) {
    const { namespace, componentName: name, version } = urn;
    const url = path.join(repositoryURL, namespace, name, version, 'package.tar.gz');
    const fetchResult = await fetch(url);
    return await fetchResult.text();
}