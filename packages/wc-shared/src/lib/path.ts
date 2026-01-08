import { dirname, join, relative, resolve } from "node:path";

export function resolvePath(...segments: string[]): string {
	return resolve(join(...segments));
}

export function joinPath(...segments: string[]): string {
	return join(...segments);
}

export function dirnamePath(filePath: string): string {
	return dirname(filePath);
}

export function relativePath(from: string, to: string): string {
	return relative(from, to);
}
