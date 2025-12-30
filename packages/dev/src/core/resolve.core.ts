export function redefineWebComponentClass(jsContent: string, name: string, prefix: string) {
    const className = `w13c_${name.replace(/-/g, "_")}`;

    let newJsContent = jsContent.replace(
        /class\s+([A-Za-z0-9_]+)\s+extends\s+/g, 
        `class ${className} extends `
    );

    newJsContent = newJsContent.replace(
        /customElements\.define\(['"`].*?['"`],\s*([A-Za-z0-9_]+)\s*\)/g, 
        `customElements.define('${prefix + name}', ${className})`
    );

    return newJsContent;
}

export function urnDestructered(signature: string){
    const namespace = signature.split("/")[0];
    const [componentName, version] = signature.split("/")[1].split("@");
    return {
        namespace,
        componentName,
        version: version
    }
}

export function resolveContentToArray(content: Record<string, string>): { name: string; signature: string }[] {
    const result: { name: string; signature: string }[] = [];
    Object.entries(content).forEach(([name, signature]) => {
        result.push({ name, signature });
    });
    return result;
}