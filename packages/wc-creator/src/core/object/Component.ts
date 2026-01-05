import path from "node:path";
import {
	fileExists,
	type ManifestType,
	readTextFromFile,
	validateManifest,
} from "@shared";
import { Config } from "./Config";
import { Controller } from "./Controller";

export class Component {
	private script: string;
	private previewHTML: string;
	private manifest: ManifestType;
	private path: string;
	private layoutPreview: string;
	private urn: string;

	constructor(manifest: ManifestType, path: string, layoutPreview: string) {
		if (!validateManifest(manifest)) {
			console.error(
				`Invalid manifest structure in component at path "${path}".`,
			);
		}
		this.manifest = manifest;
		this.path = path;
		this.script = "";
		this.previewHTML = "";
		this.layoutPreview = layoutPreview;
		this.urn = `${this.manifest.namespace}/${this.manifest.tag}@${this.manifest.version}`;
	}

	displayListItem(): string {
		return `<li><a href="/component/${this.manifest.namespace}/${this.manifest.tag}/${this.manifest.version}/preview">${this.manifest.namespace}/${this.manifest.tag}@${this.manifest.version}</a> - Path: ${this.path}</li>`;
	}

	sort(other: Component): number {
		if (this.manifest.namespace < other.manifest.namespace) return -1;
		if (this.manifest.namespace > other.manifest.namespace) return 1;
		if (this.manifest.tag < other.manifest.tag) return -1;
		if (this.manifest.tag > other.manifest.tag) return 1;
		if (this.manifest.version < other.manifest.version) return -1;
		if (this.manifest.version > other.manifest.version) return 1;
		return 0;
	}

	getVersion(): string {
		return this.manifest.version;
	}

	async getPreviewHTML(): Promise<string> {
		if (this.previewHTML === "") await this.loadPreview();
		return this.previewHTML;
	}

	async getScript(): Promise<string> {
		if (this.script === "") await this.loadScript();
		return this.script;
	}

	async getAsset(fileName: string) {
		const pathAssets = path.join(Config.cwd, this.path, fileName);
		if (!fileExists(pathAssets)) return null;
		return pathAssets;
	}

	async loadScript(tag?: string) {
		const className = `w13c_${(tag ?? this.manifest.tag).replace(/-/g, "_")}`;
		const html = await readTextFromFile(
			path.join(Config.cwd, this.path, this.manifest.htmlFile),
		);
		const css = await readTextFromFile(
			path.join(Config.cwd, this.path, this.manifest.cssFile),
		);
		let js = await readTextFromFile(
			path.join(Config.cwd, this.path, this.manifest.jsFile),
		);

		js = js
			.replace("<!-- {{ W13C__HTML }} -->", `${html}`)
			.replace("<!-- {{ W13C__CSS }} -->", `${css}`)
			.replace(
				/class\s+([A-Za-z0-9_]+)\s+extends\s+/g,
				`class ${className} extends `,
			)
			.replace(
				/customElements\.define\(['"].*?['"],\s*([A-Za-z0-9_]+)\s*\)/g,
				`customElements.define('w13c-${tag ?? this.manifest.tag}', ${className})`,
			);
		const components = Controller.getComponents();
		if (
			!this.manifest.components ||
			Object.keys(this.manifest.components).length === 0
		) {
			this.script = js;
			return js;
		}
		for (const item of Object.keys(this.manifest.components)) {
			const componentURN = this.manifest.components[item];
			if (!componentURN || !components[componentURN]) {
				console.warn(
					`Component ${componentURN} not found for inclusion in ${this.urn}`,
				);
				continue;
			}
			js = js += await components[componentURN].loadScript(item);
		}
		this.script = js;
	}

	async loadPreview() {
		const componentPreview = path.join(
			Config.cwd,
			this.path,
			this.manifest.previewFile,
		);
		if (!fileExists(componentPreview)) {
			console.warn(
				`Preview HTML does not exist in component path ${this.path}`,
			);
			return;
		}
		const preview = await readTextFromFile(componentPreview);

		const regexOpenTag = new RegExp(
			`<${this.manifest.tag}((\\s(?:[^"'>]|"[^"]*"|'[^']*')*)?)>`,
			"gi",
		);
		const regexCloseTag = new RegExp(`</${this.manifest.tag}>`, "gi");
		this.previewHTML = this.layoutPreview
			.replace("/* web_components_script  */", await this.getScript())
			.replace("<!-- {{ content }} -->", preview)
			.replace(regexOpenTag, `<w13c-${this.manifest.tag}$1>`)
			.replace(regexCloseTag, `</w13c-${this.manifest.tag}>`);
		for (const item of Object.keys(this.manifest.components || {})) {
			const regexOpenTag = new RegExp(
				`<${item}((\\s(?:[^"'>]|"[^"]*"|'[^']*')*)?)>`,
				"gi",
			);
			const regexCloseTag = new RegExp(`</${item}>`, "gi");
			this.previewHTML = this.previewHTML
				.replace(regexOpenTag, `<w13c-${item}$1>`)
				.replace(regexCloseTag, `</w13c-${item}>`);
		}
		return Promise.resolve();
	}
}
