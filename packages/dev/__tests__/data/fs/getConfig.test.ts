import { getConfig } from '@/data/fs/getConfig';
import { expect, test } from "bun:test";

test('Test getConfig()', async () => {

    process.env.W13C_WORK_DIR = "__tests__/resources/";
    process.env.W13C_CONFIG_PATH = "config.json";

    const config = await getConfig();
    console.log(config);
});