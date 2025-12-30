import { CONFIG } from "@/data/local/config.local.data";

export const serveStaticFiles = (port: number, where: string, onRequest: (req: Request & { localDestination: string }) => Promise<void>) => {
    const server = Bun.serve({
        port: port,
        async fetch(req) {
            const url = new URL(req.url);
            let path = url.pathname;

            if (path.endsWith("/")) path += "index.html";
            if (!path.includes(".")) path += ".html";
            const file = Bun.file(`${where}${path}`);
            await onRequest(Object.assign(req, { localDestination: path }));
            if (!await file.exists()) {
                await onRequest(Object.assign(req, { localDestination: `${CONFIG.website["404"]}` }));
                return new Response(Bun.file(`${where}/${CONFIG.website["404"]}`), { status: 404 });
            }
            return new Response(file);
        },
    });

    const stop = () => {
        server.stop();
    };

    return stop;
}