import template from "../../../data/home.html";
import { Controller } from "./Controller";

export class HomePage {
	private html: string;

	constructor() {
		this.html = "";
	}

	async getHTML(): Promise<string> {
		if (this.html === "") await this.load();
		return this.html;
	}

	async load() {
		const components = Object.values(Controller.getComponents());
		components.sort((a, b) => a.sort(b));
		const html = await Promise.all(
			components.map((component) => component.displayListItem()),
		);
		this.html = template.replace(
			"<!-- {{ components_list }} -->",
			html.join("\n"),
		);
	}
}
