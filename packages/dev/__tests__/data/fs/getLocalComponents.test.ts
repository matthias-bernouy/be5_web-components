import { getLocalComponents } from '@/data/fs/getLocalComponents';
import { expect, test, describe } from "bun:test";


test('Test getLocalComponents()', async () => {
    const components = await getLocalComponents("__tests__/resources/local-components-rec/");
    components.forEach( item => {
        expect(item).toBeDefined();
        expect(typeof item).toBe('string');
        expect(item.endsWith('manifest.json')).toBe(false);
    });
    expect(components.length).toBe(4);
});