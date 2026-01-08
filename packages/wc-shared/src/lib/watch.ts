import chokidar, { type FSWatcher } from "chokidar";

export class Watcher {
	private watcher: FSWatcher;

	constructor(dir: string) {
		this.watcher = chokidar.watch(dir, {
			persistent: true,
		});
	}

	on(
		event: "add" | "change" | "unlink",
		callback: (path: string) => void,
	) {
		this.watcher.on(event, callback);
	}

	stop() {
		this.watcher.close();
	}
}
