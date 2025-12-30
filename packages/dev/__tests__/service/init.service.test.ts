import { CONFIG, initConfig } from '@/data/local/config.local.data';
import buildBundle from '@/entry/service/build.service';
import { initService } from '@/entry/service/init.service';
import { expect, test } from "bun:test";
import { rmdir, rmdirSync, rmSync } from 'node:fs';
import { describe } from 'node:test';

const folder = "__bar__init__service__";

describe('Init Service Tests', () => {
    test('Test Init Service With Basic Project And Test Paths are good', async () => {
        rmSync(folder, { recursive: true, force: true });
        await initService(folder);

        process.env.W13C_WORK_DIR = folder;
        await initConfig();

        expect(CONFIG.workDir.endsWith(folder)).toBe(true);

        expect(CONFIG.website.source.endsWith("website")).toBe(true);
        expect(CONFIG.website.output.endsWith(".dist")).toBe(true);
        expect(CONFIG.website["404"].endsWith("website/e/404.html")).toBe(true);
        expect(CONFIG.website.port).toBe(80);

        expect(CONFIG.components.localFolder.endsWith("components/local")).toBe(true);
        expect(CONFIG.components.distFolder.endsWith("components/dist")).toBe(true);
        expect(CONFIG.components.output.endsWith(".dist/bundle.js")).toBe(true);
        expect(CONFIG.components.resolveFile.endsWith("resolve.json")).toBe(true);

        rmSync(folder, { recursive: true, force: true });
    });

});