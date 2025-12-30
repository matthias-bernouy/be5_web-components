import { replaceHTMLTags } from "@/core/htmlParser.core";
import { expect, test } from "bun:test";

test('test htmlParser()', () => {
    const htmlContent = `<div data-condition="if width < 500px and width > 300px" data-id="test-data" srcset="(width > 500px)"><p>Hello World</p></div>`;

    const res = replaceHTMLTags(htmlContent, 'div', 'section');

    expect(res).toBe(`<section data-condition="if width < 500px and width > 300px" data-id="test-data" srcset="(width > 500px)"><p>Hello World</p></section>`);
});