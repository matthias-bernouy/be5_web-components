export const serveStaticFiles = (
    port: number, 
    where: string, 
    e404: string, 
    onRequest: (req: Request & { localDestination: string }) => Promise<void>,
) => {

    let lastStatus = Date.now();

    const updateStatus = (n: number) => {
        lastStatus = n;
    }

    const server = Bun.serve({
        port: port,
        async fetch(req) {
            const url = new URL(req.url);
            let path = url.pathname;

            if ( path === "/devModeStatus" ) {
                return new Response(lastStatus.toString());
            }

            if (path.endsWith("/")) path += "index.html";
            if (!path.includes(".")) path += ".html";
            const file = Bun.file(`${where}${path}`);
            await onRequest(Object.assign(req, { localDestination: path }));
            if (!await file.exists()) {
                //await onRequest(Object.assign(req, { localDestination: e404 }));
                //return new Response(Bun.file(`${where}/${e404}`), { status: 404 });
                return new Response("ERROR 404", { status: 404 });
            }
            return new Response(file);
        },
    });

    const stop = () => {
        server.stop();
    };

    return { stop, updateStatus };
}