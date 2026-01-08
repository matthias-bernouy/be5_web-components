export type Handler = (request: HTTPRequest) => Response | Promise<Response>;

type RouteDefinition = {
	[method: string]: (req: Request) => Response | Promise<Response>;
};

export class HTTPServer {
	private port: number;
	private routes: Record<string, RouteDefinition> = {};
	// private notFoundHandler: Handler | null = null;

	constructor(opts?: {
		port?: number;
	}) {
		this.port = opts?.port ?? 8080;
	}

	private createRouteDefinition(
		path: string,
		method: string,
		handler: Handler,
	) {
		if (!this.routes[path]) this.routes[path] = {};
		this.routes[path][method] = async (req: any) => {
			const url = new URL(req.url);
			const queryParams = Object.fromEntries(url.searchParams.entries());
			return handler({
				method: req.method,
				url: req.url,
				path: url.pathname,
				headers: req.headers,
				params: { ...queryParams, ...req.params },
				body: {
					txt: () => req.text(),
					json: () => req.json(),
					bytes: () => req.body?.bytes(),
					blob: () => req.body?.blob(),
				},
			});
		};
	}

	post(path: string, handler: Handler) {
		this.createRouteDefinition(path, "POST", handler);
		return this;
	}

	get(path: string, handler: Handler) {
		this.createRouteDefinition(path, "GET", handler);
		return this;
	}

	put(path: string, handler: Handler) {
		this.createRouteDefinition(path, "PUT", handler);
		return this;
	}

	delete(path: string, handler: Handler) {
		this.createRouteDefinition(path, "DELETE", handler);
		return this;
	}

	options(path: string, handler: Handler) {
		this.createRouteDefinition(path, "OPTIONS", handler);
		return this;
	}

	patch(path: string, handler: Handler) {
		this.createRouteDefinition(path, "PATCH", handler);
		return this;
	}

	// notFound(handler: Handler) {
	// 	this.notFoundHandler = handler;
	// }

	start() {
		return Bun.serve({
			port: this.port,
			routes: this.routes,
			fetch: async () => {
				return new Response("Not Found", { status: 404 });
			},
		});
	}
}
