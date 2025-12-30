import { replaceHTMLTags } from "@/core/htmlParser.core";
import { resolveContentToArray, redefineWebComponentClass, urnDestructered } from "@/core/resolve.core";
import { getConfig } from "@/data/fs/getConfig";
import { fileExists, readJsonFromFile, readTextFromFile, writeTextToFile } from "@/lib/file.lib";
import path from "node:path";
import { bundleLocalComponents } from "./component.service";

export default async function bundleWebComponents() {
    const CONFIG = await getConfig();
    if ( !await fileExists(CONFIG.components.resolveFile) ) return;
    const resolveJSON = await readJsonFromFile(CONFIG.components.resolveFile);

    let dataBundleFile = '';
    const elements = resolveContentToArray(resolveJSON);
    for (const element of elements){
        dataBundleFile += await getBundleImportData(element.signature, element.name);
    }

    dataBundleFile += await bundleLocalComponents();

    await writeTextToFile(CONFIG.components.output, dataBundleFile);
    return;
}

export async function buildPage(src: string){
    const CONFIG = await getConfig();
    const srcPath = path.join(CONFIG.website.source, src);  
    if ( !await fileExists(srcPath) ) return;
    let html = await readTextFromFile(srcPath);
    const resolveFileContent = await readJsonFromFile(CONFIG.components.resolveFile);
    const tags = resolveContentToArray(resolveFileContent);
    tags.forEach(tag => {
        html = replaceHTMLTags(html, tag.name, CONFIG.components.prefix + tag.name);
    });
    let htmlTemplate = await readTextFromFile(path.join("src/data/resources", 'htmlPage.html'));
    htmlTemplate = htmlTemplate.replace("{{ W13C_PAGE_CONTENT }}", html);

    await writeTextToFile(path.join(CONFIG.website.output, src), htmlTemplate);
    return;
}

async function getBundleImportData(signature: string, name: string){
    const CONFIG = await getConfig();
    const urnDest = urnDestructered(signature);
    let dataComponent = await readTextFromFile(path.join(CONFIG.components.external, urnDest.namespace, urnDest.componentName, urnDest.version, 'core.js'));
    dataComponent = redefineWebComponentClass(dataComponent, name, CONFIG.components.prefix);
    return `\n// ---- Import ${name} ---- \n` + dataComponent + `\n// ---- End Import ${name} ---- \n`;
}