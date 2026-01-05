export async function startWebSocket() {
	const server = Bun.serve({
		fetch(req, server) {
			const success = server.upgrade(req);
			if (success) {
				return undefined;
			}
			return new Response("Hello world");
		},
		port: 8081,
		websocket: {
			open(ws) {
				ws.subscribe("reloading");
			},
			message(_ws, _message) {},
			close(ws, _code, _reason) {
				ws.unsubscribe("reloading");
			},
		},
	});

	function reloading() {
		server.publish("reloading", "reload");
	}

	return { reloading };
}
