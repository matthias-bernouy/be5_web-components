import { aggregateComponent, isManifestValid, isNameValid, readManifest } from "@/core/component.core";
import { redefineWebComponentClass, urnDestructered } from "@/core/resolve.core";
import { getPackageFromRepository } from "@/data/fetch/getPackageFromRepository";
import { getConfig } from "@/data/fs/getConfig";
import { getLocalComponents } from "@/data/fs/getLocalComponents";
import { dirExists, fileExists, readJsonFromFile, readTextFromFile, writeJsonToFile, writeTextToFile } from "@/lib/file.lib";
import { extractAllFilesFromTar } from "@/lib/tar.lib";
import path from "node:path";

// Import component from repository
export async function importComponent(name: string, urn: string) {
    const CONFIG = await getConfig();
    if ( !isNameValid(name) ) {
        throw new Error(`Component name ${name} is not valid.`, { cause: 'invalid-component-name' });
    }

    const urnDest = urnDestructered(urn);

    const pathToComponent = path.join(CONFIG.components.external, urnDest.namespace, urnDest.componentName, urnDest.version);

    if ( await dirExists(pathToComponent) ) {
        throw new Error(`Component ${name} already exists locally.`, { cause: 'component-already-exists-locally' });
    }

    const actualJSON = await readJsonFromFile(CONFIG.components.resolveFile) as Record<string, string>;
    actualJSON[name] = urn;

    const archiveContent = await getPackageFromRepository(urnDest, CONFIG.components.repository);


    await writeJsonToFile(CONFIG.components.resolveFile, actualJSON);
    await writeTextToFile(path.join(pathToComponent, 'archive.zip'), archiveContent);
    extractAllFilesFromTar(path.join(pathToComponent, 'archive.zip'), pathToComponent);
}

// Publish component to repository
export async function publishComponent() {
    return;
}

// Check validity of component and build it
export async function bundleLocalComponents() {

    let ret = "";

    const CONFIG = await getConfig();
    const localComponents = await getLocalComponents(CONFIG.components.local);

    for ( const component of localComponents ) {

        if ( !await fileExists(path.join(component, 'manifest.json')) ) continue;
        const manifest = await readTextFromFile(path.join(component, 'manifest.json'));
        const manifestJSON = readManifest(manifest);

        if ( !isManifestValid(manifestJSON) ) continue;

        const htmlContent = await readTextFromFile(path.join(component, manifestJSON.htmlFiles));
        const cssContent = await readTextFromFile(path.join(component, manifestJSON.cssFiles));
        const jsContent = await readTextFromFile(path.join(component, manifestJSON.coreFiles));

        const aggregatedContent = aggregateComponent(htmlContent, cssContent, jsContent);
        const redefinedContent = redefineWebComponentClass(aggregatedContent, manifestJSON.name, "local-");

        ret += `\n// ---- Component ${manifestJSON.name} ---- \n` + redefinedContent + `\n// ---- End Component ${manifestJSON.name} ---- \n`;
    }

    return ret;
}
