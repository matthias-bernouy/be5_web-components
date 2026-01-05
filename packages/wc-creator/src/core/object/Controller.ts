import { loadComponents } from "../loader/loadComponents";
import type { Component } from "./Component";
import { Config } from "./Config";
import { HomePage } from "./HomePage";

export class Controller {
	private static components: Record<string, Component> = {};
	private static homePage: HomePage;

	static async initialize() {
		await Config.initialize();
		await loadComponents();
		Controller.homePage = new HomePage();
	}

	static async loadComponents() {
		Controller.components = await loadComponents();
	}

	static getComponents(): Record<string, Component> {
		return Controller.components;
	}

	static getComponent(urn: string): Component | null {
		return Controller.components[urn] || null;
	}

	static getHomePage(): HomePage {
		return Controller.homePage;
	}
}
