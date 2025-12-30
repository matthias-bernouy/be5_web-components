import { CONFIG } from "@/data/local/config.local.data";
import { replaceHTMLTags } from "@/core/htmlParser.core";
import { resolveContentToArray, redefineWebComponentClass, urnDestructered } from "@/core/resolve.core";
import { writeBundleFile } from "@/data/local/bundle.local.data";
import { readComponentCoreFileFromDist } from "@/data/local/component.local.data";
import { getPageContentFromSource, isPageFile, writePageContentToOutput } from "@/data/local/page.local.data";
import { readResolveFileContentJson, resolveFileExists } from "@/data/local/resolve.local.data";

export default async function bundleService() {
    if ( !await resolveFileExists() ) return;
    const resolveJSON = await readResolveFileContentJson();

    let dataBundleFile = '';
    const elements = resolveContentToArray(resolveJSON);
    for (const element of elements){
        dataBundleFile += await getBundleImportData(element.signature, element.name);
    }

    await writeBundleFile(dataBundleFile);
    return;
}

export async function buildPage(src: string){
    if ( !isPageFile(src) ) return;
    let html = await getPageContentFromSource(src);
    const resolveFileContent = await readResolveFileContentJson();
    const tags = resolveContentToArray(resolveFileContent);
    tags.forEach(tag => {
        html = replaceHTMLTags(html, tag.name, CONFIG.components.prefix + tag.name);
    });
    await writePageContentToOutput(src, html);
    return;
}

async function getBundleImportData(signature: string, name: string){
    const urnDest = urnDestructered(signature);
    let dataComponent = await readComponentCoreFileFromDist(urnDest);
    dataComponent = redefineWebComponentClass(dataComponent, name, CONFIG.components.prefix);
    return `\n// ---- Import ${name} ---- \n` + dataComponent + `\n// ---- End Import ${name} ---- \n`;
}