
export function replaceHTMLTags(html: string, fromTag: string, toTag: string): string {
    const regexOpenTag = new RegExp(`<${fromTag}((\\s(?:[^"'>]|"[^"]*"|'[^']*')*)?)>`, 'gi');    
    const regexCloseTag = new RegExp(`</${fromTag}>`, 'gi');
    html = html.replace(regexOpenTag, `<${toTag}$1>`);
    html = html.replace(regexCloseTag, `</${toTag}>`);
    return html;
}