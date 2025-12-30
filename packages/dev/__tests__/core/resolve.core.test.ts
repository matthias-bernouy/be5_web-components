import { resolveContentToArray, redefineWebComponentClass, urnDestructered } from '@/core/resolve.core';
import { expect, test } from "bun:test";

test('test urnDestructered()', () => {
  const res = urnDestructered("be5/card-test@1.0.0");
  expect(res).toEqual({
    namespace: "be5",
    componentName: "card-test",
    version: "1.0.0"
  });
});

test('test redefineWebComponentClass()', async () => {
  const jsFile = Bun.file("__foo__/web-components/be5/sample-web-component/1.0.0/bundle.js");
  const jsContent = await jsFile.text();

  const modifiedContent = redefineWebComponentClass(jsContent, "my-custom-element", "w13c-");

  expect(modifiedContent).not.toContain("class UserCard extends HTMLElement");
  expect(modifiedContent).toMatch(/class w13c_my_custom_element extends HTMLElement/);
  expect(modifiedContent).toContain("customElements.define('w13c-my-custom-element', w13c_my_custom_element)");
});

test('test resolveContentToArray()', async () => {
  const data = {
    "card": "be5/card@1.0.0"
  };
  const res = resolveContentToArray(data);
  expect(res).toEqual([
    { name: "card", signature: "be5/card@1.0.0" }
  ]);
});
