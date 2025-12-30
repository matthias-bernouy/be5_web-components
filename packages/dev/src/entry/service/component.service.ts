import { aggregateComponent, isManifestValid, isNameValid, readManifest } from "@/core/component.core";
import { urnDestructered } from "@/core/resolve.core";
import { getPackageFromRepository } from "@/data/external/repository.external.data";
import { archiveAlreadyExists, writeArchiveToDistComponentsFolder, openArchive, existsComponentElement, getLocalComponents, readComponentElement, writeWebComponentBundle } from "@/data/local/component.local.data";
import { readResolveFileContentJson, writeResolveFileContentJson } from "@/data/local/resolve.local.data";
import { copyDefaultComponent } from "@/data/local/resources.local.data";

export async function createComponent(name: string){
    if ( !isNameValid(name) ){
        throw new Error("Component name is not valid. Use only lowercase letters and hyphens.", { cause: 'invalid-name' });
    };
    const resolveContent = await readResolveFileContentJson();
    if ( resolveContent[name] ){
        throw new Error(`Component with name ${name} already exists in resolve.json.`, { cause: 'component-already-exists' });
    }
    resolveContent[name] = "local/" + name + "@0.0.0";
    await writeResolveFileContentJson(resolveContent);
    await copyDefaultComponent(name);
}

export async function importComponent(name: string, urn: string) {
    const urnDest = urnDestructered(urn);

    if ( await archiveAlreadyExists(urnDest) ) return;

    const actualJSON = await readResolveFileContentJson();
    actualJSON[name] = urn;

    const archiveContent = await getPackageFromRepository(urnDest);


    await writeResolveFileContentJson(actualJSON);
    writeArchiveToDistComponentsFolder(urnDest, archiveContent);
    openArchive(urnDest);
}

export async function publishComponent() {
    return;
}

export async function buildComponent() {
    const localComponents = getLocalComponents();
    for ( const component of localComponents ) {

        if ( !await existsComponentElement(component, 'manifest.json') ) continue;
        const manifest = await readComponentElement(component, 'manifest.json');
        const manifestJSON = readManifest(manifest);

        if ( !isManifestValid(manifest) ) continue;

        const htmlContent = await readComponentElement(component, manifestJSON.htmlFiles);
        const cssContent = await readComponentElement(component, manifestJSON.cssFiles);
        const jsContent = await readComponentElement(component, manifestJSON.coreFiles);

        const aggregatedContent = aggregateComponent(htmlContent, cssContent, jsContent);

        await writeWebComponentBundle({ 
            componentName: component, 
            namespace: manifestJSON.namespace, 
            version: manifestJSON.version 
        }, aggregatedContent);
    }
}
