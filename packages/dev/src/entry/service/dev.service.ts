import { CONFIG } from "@/data/local/config.local.data";
import { watch } from "node:fs";
import bundleService, { buildPage } from "./build.service";
import { buildComponent } from "./component.service";
import { serveStaticFiles } from "@/lib/server.lib";

export async function devService() {

    await buildComponent();
    await bundleService();

    serveStaticFiles(CONFIG.website.port, CONFIG.website.output, async (req: Request & { localDestination: string }) => {
        if ( !req.localDestination.endsWith(".html") ) return;
        await buildPage(req.localDestination);
    });

    // watch(CONFIG.directories.localComponents, { recursive: true }, async (eventType, filename) => {
    //     await buildComponent();
    // });

    // watch(CONFIG.directories.distComponents, { recursive: true }, async (eventType, filename) => {
    //     await bundleService();
    // });

}