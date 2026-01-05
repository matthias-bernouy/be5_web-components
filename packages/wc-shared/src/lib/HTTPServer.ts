export type Handler = (request: Request) => Response | Promise<Response>;

type RouteDefinition = {
	[method: string]: (req: Request) => Response | Promise<Response>;
};

export class HTTPServer {
	private port: number;
	private routes: Record<string, RouteDefinition> = {};
	private notFoundHandler: Handler | null = null;

	constructor(opts?: {
		port?: number;
	}) {
		this.port = opts?.port ?? 8080;
	}

	post(path: string, handler: (req: Request) => Response | Promise<Response>) {
		if (!this.routes[path]) this.routes[path] = {};
		this.routes[path].POST = handler;
		return this;
	}

	get(path: string, handler: (req: Request) => Response | Promise<Response>) {
		if (!this.routes[path]) this.routes[path] = {};
		this.routes[path].GET = handler;
		return this;
	}

	put(path: string, handler: (req: Request) => Response | Promise<Response>) {
		if (!this.routes[path]) this.routes[path] = {};
		this.routes[path].PUT = handler;
		return this;
	}

	delete(
		path: string,
		handler: (req: Request) => Response | Promise<Response>,
	) {
		if (!this.routes[path]) this.routes[path] = {};
		this.routes[path].DELETE = handler;
		return this;
	}

	options(
		path: string,
		handler: (req: Request) => Response | Promise<Response>,
	) {
		if (!this.routes[path]) this.routes[path] = {};
		this.routes[path].OPTIONS = handler;
		return this;
	}

	patch(path: string, handler: (req: Request) => Response | Promise<Response>) {
		if (!this.routes[path]) this.routes[path] = {};
		this.routes[path].PATCH = handler;
		return this;
	}

	notFound(handler: (req: Request) => Response | Promise<Response>) {
		this.notFoundHandler = handler;
	}

	start() {
		return Bun.serve({
			port: this.port,
			routes: this.routes,
			fetch: async (req: Request) => {
				return this.notFoundHandler
					? this.notFoundHandler(req)
					: new Response("Not Found", { status: 404 });
			},
		});
	}
}
