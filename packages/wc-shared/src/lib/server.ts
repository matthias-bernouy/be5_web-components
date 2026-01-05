export const serveStaticFiles = (
	port: number,
	onRequest: (dest: string) => Promise<{ content: string }>,
) => {
	let _lastStatus = Date.now();

	const updateStatus = (n: number) => {
		_lastStatus = n;
	};

	const server = Bun.serve({
		port: port,
		async fetch(req) {
			const url = new URL(req.url);
			const path = url.pathname;
			const res = await onRequest(path);
			let fileType = "text/html";
			if (
				path.endsWith(".png") ||
				path.endsWith(".gif") ||
				path.endsWith(".svg") ||
				path.endsWith(".jpg") ||
				path.endsWith(".jpeg")
			) {
				return new Response(Bun.file(res.content));
			} else if (path.endsWith(".js")) {
				fileType = "application/javascript";
			} else if (path.endsWith(".css")) {
				fileType = "text/css";
			}
			return new Response(res.content, {
				headers: { "Content-Type": fileType },
			});
		},
	});

	const stop = () => {
		server.stop();
	};

	return { stop, updateStatus };
};
