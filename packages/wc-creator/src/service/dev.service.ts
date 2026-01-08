import { serveStaticFiles, startWebSocket, Watcher } from "@shared";
import { Config } from "../core/object/Config";
import { Controller } from "../core/object/Controller";

export async function startCreatorDev() {
	const started = Date.now();

	await Controller.initialize();
	const homePage = Controller.getHomePage();
	await Controller.loadComponents();
	homePage.load();

	const { reloading } = await startWebSocket();

	serveStaticFiles(Config.port, async (dest: string) => {
		if (dest === "/") {
			return { content: await homePage.getHTML() };
		}

		if (dest.startsWith("/component/")) {
			const regex =
				/^\/component\/([a-z0-9]+)\/([a-z0-9]+)\/([0-9]+\.[0-9]+\.[0-9]+)(.+)/;
			const match = dest.match(regex);

			if (!match) return { content: `INVALID COMPONENT PATH: ${dest}` };
			const namespace = match[1];
			const tag = match[2];
			const version = match[3];
			const urn = `${namespace}/${tag}@${version}`;
			const component = Controller.getComponents()[urn];
			if (!component) {
				return { content: `COMPONENT NOT FOUND: ${urn}` };
			}
			if (dest.endsWith("/preview")) {
				return { content: await component.getPreviewHTML() };
			}
			if (match[4] && (await component.getAsset(match[4]))) {
				return { content: (await component.getAsset(match[4])) as string };
			}
		}

		return { content: `UNDEFINED PATH: ${dest}` };
	});

	const watcher = new Watcher(Config.cwd);

	const watchHandle = async () => {
		await new Promise((res) => setTimeout(res, 1000));
		await Controller.loadComponents();
		await homePage.load();
		const formatDate = new Date(Date.now() - started)
			.toISOString()
			.slice(11, 19);
		console.info(`[ ${formatDate} ] Reloading... `);
		reloading();
	};

	watcher.on("add", () => {
		watchHandle();
	});

	watcher.on("change", () => {
		watchHandle();
	});

	watcher.on("unlink", () => {
		watchHandle();
	});
}
