import { CONFIG } from "@/data/local/config.local.data";
import type { packageURNDestructured } from "types/packageURN.type";
import path from "node:path";
import { mkdirSync, readdirSync } from "node:fs";
import { extractAllFilesFromTar } from "@/lib/tar.lib";

export async function writeArchiveToDistComponentsFolder(urn: packageURNDestructured, content: string) {
    const { namespace, componentName, version } = urn;
    const pathToFile = path.join(
        CONFIG.components.distFolder,
        namespace,
        componentName,
        version,
        'archive.tar.gz'
    );
    mkdirSync(path.dirname(pathToFile), { recursive: true });
    await Bun.write(pathToFile, content);
}

export async function archiveAlreadyExists(urn: packageURNDestructured) {
    const { namespace, componentName, version } = urn;
    const pathToLocalArchive = path.join(
        CONFIG.components.distFolder,
        namespace,
        componentName,
        version,
        'archive.tar.gz'
    );
    return await Bun.file(pathToLocalArchive).exists();
}

export function openArchive(urn: packageURNDestructured) {
    const { namespace, componentName, version } = urn;
    const input = path.join(
        CONFIG.components.distFolder,
        namespace,
        componentName,
        version,
        'archive.tar.gz'
    );
    const output = path.join(
        CONFIG.components.distFolder,
        namespace,
        componentName,
        version
    );
    extractAllFilesFromTar(input, output);
}

export function writeWebComponentBundle(urn: packageURNDestructured, content: string) {
    const { namespace, componentName, version } = urn;
    const pathToCoreFile = path.join(
        CONFIG.components.distFolder,
        namespace,
        componentName,
        version,
        'bundle.js'
    );
    const file = Bun.file(pathToCoreFile);
    return file.write(content);
}

export function readComponentCoreFileFromDist(urn: packageURNDestructured) {
    const { namespace, componentName, version } = urn;
    const pathToCoreFile = path.join(
        CONFIG.components.distFolder,
        namespace,
        componentName,
        version,
        'bundle.js'
    );
    const file = Bun.file(pathToCoreFile);
    return file.text();
}

export function readComponentElement(componentName: string, element: string) {
    const pathToCoreFile = path.join(
        CONFIG.components.localFolder,
        componentName,
        element
    );
    const file = Bun.file(pathToCoreFile);
    return file.text();
}

export function existsComponentElement(componentName: string, element: string) {
    const pathToCoreFile = path.join(
        CONFIG.components.localFolder,
        componentName,
        element
    );
    const file = Bun.file(pathToCoreFile);
    return file.exists();
}

export function getLocalComponents() {
    const localComponents : string[] = [];
    const basePath = CONFIG.components.localFolder;
    const components = readdirSync(basePath, { withFileTypes: true });
    components.map((component) => {
        localComponents.push(component.name);
    })
    return localComponents;
}

