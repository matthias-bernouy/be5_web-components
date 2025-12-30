import { getConfig } from "@/data/fs/getConfig";
import bundleWebComponents, { buildPage } from "./build.service";
import { serveStaticFiles } from "@/lib/server.lib";
import { watch } from "node:fs";



export async function devService() {

    const lastChanged = Date.now();
    const CONFIG = await getConfig();

    const { stop, updateStatus } = serveStaticFiles(CONFIG.website.port, CONFIG.website.output, CONFIG.website["404"], async (req: Request & { localDestination: string }) => {

        if ( req.localDestination.endsWith(".html") ) {
            await buildPage(req.localDestination);
        };

        if ( req.localDestination.endsWith("bundle.js") ) {
            await bundleWebComponents();
        }

    });

    watch(CONFIG.components.local, { recursive: true }, async (eventType, filename) => {
        console.log(`[DEV SERVICE] - Detected change in component files: ${filename} (${eventType})`);
        updateStatus(Date.now());
    })

}