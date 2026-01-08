import { readdir } from "node:fs/promises";
import {
	fileExists,
	join,
	type ManifestType,
	readJsonFromFile,
	relative,
} from "@shared";
import default_layout from "../../../data/preview_layout.html";
import { Component } from "../object/Component";
import { Config } from "../object/Config";

export async function loadComponents() {
	try {
		return await fnRec(Config.cwd);
	} catch (error) {
		console.error(
			`Error getting components from directory ${Config.cwd}:`,
			error,
		);
		return {};
	}
}

async function fnRec(dir: string): Promise<Record<string, Component>> {
	const manifestPath = join(dir, "manifest.json");

	if (await fileExists(manifestPath)) {
		const content = (await readJsonFromFile(manifestPath)) as ManifestType;
		const key = `${content.namespace}/${content.tag}@${content.version}`;
		return {
			[key]: new Component(content, relative(Config.cwd, dir), default_layout),
		};
	}

	const entries = await readdir(dir, { withFileTypes: true });

	const tasks = entries
		.filter(
			(entry) =>
				entry.isDirectory() &&
				!entry.name.startsWith(".") &&
				entry.name !== "node_modules",
		)
		.map((entry) => fnRec(join(dir, entry.name)));

	const results = await Promise.all(tasks);

	// Check for duplicate keys
	const allKeys = results.flatMap((result) => Object.keys(result));
	const duplicates = allKeys.filter(
		(item, index) => allKeys.indexOf(item) !== index,
	);
	if (duplicates.length > 0) {
		console.warn(
			`Warning: Duplicate component keys found: ${[...new Set(duplicates)].join(", ")}, please ensure each component has a unique namespace/tag@version combination.`,
		);
	}

	return results.reduce(
		(acc, current) => {
			// On assigne les propriétés de 'current' dans 'acc' directement
			Object.assign(acc, current);
			return acc;
		},
		{} as Record<string, Component>,
	);
}
