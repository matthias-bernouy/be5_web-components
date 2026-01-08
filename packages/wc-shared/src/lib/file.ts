import {
	mkdirSync,
	copyFileSync as nodeCopyFile,
	readdirSync,
	rmSync,
	statSync,
} from "node:fs";
import { dirname } from "node:path";
import { joinPath } from "./path";

export function readBlobFromFile(filePath: string) {
	const file = Bun.file(filePath);
	return file as unknown as Blob;
}

export async function readTextFromFile(filePath: string) {
	const file = Bun.file(filePath);
	return await file.text();
}

export async function writeToFile(
	filePath: string,
	content: string | Uint8Array,
) {
	mkdir(dirname(filePath));
	const file = Bun.file(filePath);
	return await file.write(content);
}

export function mkdir(dirPath: string) {
	mkdirSync(dirPath, { recursive: true });
}

export async function readJsonFromFile(filePath: string): Promise<any> {
	const file = Bun.file(filePath);
	return await file.json();
}

export async function writeJsonToFile(filePath: string, content: any) {
	mkdir(dirname(filePath));
	const file = Bun.file(filePath);
	return await file.write(JSON.stringify(content, null, 2));
}

export async function fileExists(filePath: string) {
	return await Bun.file(filePath).exists();
}

export async function dirExists(dirPath: string) {
	const stats = statSync(dirPath);
	return stats.isDirectory();
}

export function copyFile(srcPath: string, destPath: string) {
	nodeCopyFile(srcPath, destPath);
}

export function copyDir(src: string, dest: string) {
	mkdir(dest);
	const entries = readdirSync(src, { withFileTypes: true });

	for (const entry of entries) {
		const srcPath = joinPath(src, entry.name);
		const destPath = joinPath(dest, entry.name);

		if (entry.isDirectory()) {
			copyDir(srcPath, destPath);
		} else {
			copyFile(srcPath, destPath);
		}
	}
}

export function del(dirPath: string) {
	rmSync(dirPath, { recursive: true, force: true });
}
