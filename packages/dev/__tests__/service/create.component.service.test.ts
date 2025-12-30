import { CONFIG, initConfig } from '@/data/local/config.local.data';
import buildBundle from '@/entry/service/build.service';
import { createComponent } from '@/entry/service/component.service';
import { initService } from '@/entry/service/init.service';
import { expect, test, describe } from "bun:test";
import { rmdir, rmdirSync, rmSync } from 'node:fs';



describe('Create Component Service Tests', () => {

    const folder = "__bar__create_component_service__";

    test('Test Create Component Service', async () => {
        rmSync(folder, { recursive: true, force: true });
        await initService(folder);

        process.env.W13C_WORK_DIR = folder;
        await initConfig();

        expect(createComponent("AA@card-component")).rejects.toThrowError(expect.objectContaining({ cause: 'invalid-name' }));
        expect(createComponent("card-component")).resolves.toBeUndefined();
        expect(createComponent("card-component")).rejects.toThrowError(expect.objectContaining({ cause: 'component-already-exists' }));

        Bun.file(`${folder}/components/local/card-component/core.js`).exists().then((exists) => {
            expect(exists).toBe(true);
        });

        Bun.file(`${folder}/components/local/card-component/styles.css`).exists().then((exists) => {
            expect(exists).toBe(true);
        });

        Bun.file(`${folder}/components/local/card-component/template.html`).exists().then((exists) => {
            expect(exists).toBe(true);
        });

        Bun.file(`${folder}/components/local/card-component/manifest.json`).exists().then((exists) => {
            expect(exists).toBe(true);
        });


        rmSync(folder, { recursive: true, force: true });
    });

});