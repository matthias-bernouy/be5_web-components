import { readdirSync } from "fs";
import { cpus } from "os";
import { join, resolve } from "path";
import { Worker } from "worker_threads";

type constructorProps = {
	ratio?: number;
	taskBufferSize?: number;
	nbTasksPerWorker?: number;
};

export class ShardedServer {
	private workers: Worker[] = [];
	private routes: Map<string, Map<string, (req: Request) => Response>> =
		new Map();

	/**
	 *
	 * @param props
	 * @default ratio to ratio of cpus used (1 = all, 0.5 = half, etc.)
	 */
	constructor(props: constructorProps = {}) {
		const ratio = props.ratio ?? 1;
		const workers = Math.floor(cpus().length * ratio);
		if (workers < 1) {
			throw new Error(
				`ShardedServer: Not enough CPU cores to start workers with ratio ${ratio}.`,
			);
		}
		for (let i = 0; i < workers; i++) {
			const worker = new Worker(resolve(__dirname, "ShardedWorker.ts"));
			this.workers.push(worker);
		}
		console.info(`ShardedServer: Started ${workers} workers.`);
	}

	async autoscan(path: string) {
		const absolutePath = resolve(path);
		const files = readdirSync(absolutePath, { recursive: true });
		for (const file of files) {
			if (typeof file !== "string") continue;
			if (file.endsWith(".ts") || file.endsWith(".js")) {
				console.log(`ShardedServer: Found file ${file} for autoscan.`);
				const fullPath = join(absolutePath, file);
				const routeModule = await import(fullPath);
				if (!routeModule.default) {
					console.warn(`ShardedServer: No default export found in ${file}.`);
					continue;
				}

				console.log(routeModule.default);
			}
		}
	}

	addRoute(method: string, path: string, handler: (req: Request) => Response) {
		if (!this.routes.has(method)) {
			this.routes.set(method, new Map());
		}
		const methodRoutes = this.routes.get(method);
		if (methodRoutes) {
			methodRoutes.set(path, handler);
		}
	}

	private workerCreation() {}

	private hash(str: string): number {
		let hash = 2166136261;
		for (let i = 0; i < str.length; i++) {
			hash ^= str.charCodeAt(i);
			hash = Math.imul(hash, 16777619) >>> 0;
		}
		return hash;
	}

	run() {
		Bun.serve({
			port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
			fetch(req) {
				return new Response("Hello from ShardedServer!");
			},
		});
	}
}
