import { CONFIG, initConfig } from '@/data/local/config.local.data';
import buildBundle from '@/entry/service/build.service';
import { buildComponent, createComponent } from '@/entry/service/component.service';
import { initService } from '@/entry/service/init.service';
import { describe, expect, test, } from "bun:test";
import { rmdir, rmdirSync, rmSync } from 'node:fs';


describe('Create Component Service Tests', () => {

    const folder = "__bar__build_component_service__";

    test('Test Build Component Service', async () => {
        rmSync(folder, { recursive: true, force: true });
        await initService(folder);
        process.env.W13C_WORK_DIR = folder;
        await initConfig();

        await createComponent("card-component");
        expect(buildComponent()).resolves.toBeUndefined();

        rmSync(folder, { recursive: true, force: true });
    });

});