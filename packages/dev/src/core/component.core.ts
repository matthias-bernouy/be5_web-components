export function aggregateComponent(htmlContent: string, cssContent: string, jsContent: string) {

    htmlContent.replaceAll("`", "\\`");
    cssContent.replaceAll("`", "\\`");

    jsContent = jsContent.replace("${{ W13C__HTML }}", htmlContent);
    jsContent = jsContent.replace("${{ W13C__CSS }}", cssContent);

    return jsContent;
}

export function readManifest(manifestContent: string) {
    return JSON.parse(manifestContent) as {
        namespace: string;
        version: string;
        name: string;
        cssFiles: string;
        htmlFiles: string;
        coreFiles: string;
    };
}

export function isManifestValid(manifest: any): boolean {
    return true;
}

export function isNameValid(name: string): boolean {
    const nameRegex = /^[a-z0-9-]+$/;
    const defaultNames = [
        "a",
        "abbr",
        "address",
        "area",
        "article",
        "aside",
        "audio",
        "b",
        "base",
        "bdi",
        "bdo",
        "blockquote",
        "body",
        "br",
        "button",
        "canvas",
        "caption",
        "cite",
        "code",
        "col",
        "colgroup",
        "data",
        "datalist",
        "dd",
        "del",
        "details",
        "dfn",
        "dialog",
        "div",
        "dl",
        "dt",
        "em",
        "embed",
        "fieldset",
        "figcaption",
        "figure",
        "footer",
        "form",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "head",
        "header",
        "hgroup",
        "hr",
        "html",
        "i",
        "iframe",
        "img",
        "input",
        "ins",
        "kbd",
        "label",
        "legend",
        "li",
        "link",
        "main",
        "map",
        "mark",
        "math",
        "menu",
        "meta",
        "meter",
        "nav",
        "noscript",
        "object",
        "ol",
        "optgroup",
        "option",
        "output",
        "p",
        "picture",
        "pre",
        "progress",
        "q",
        "rp",
        "rt",
        "ruby",
        "s",
        "samp",
        "script",
        "search",
        "section",
        "select",
        "selectedcontent",
        "slot",
        "small",
        "source",
        "span",
        "strong",
        "style",
        "sub",
        "summary",
        "sup",
        "svg",
        "table",
        "tbody",
        "td",
        "template",
        "textarea",
        "tfoot",
        "th",
        "thead",
        "time",
        "title",
        "tr",
        "track",
        "u",
        "ul",
        "var",
        "video",
        "wbr"
    ];
    if (defaultNames.includes(name)) return false;
    return nameRegex.test(name);
}