import { copyFileSync as nodeCopyFile, statSync } from "node:fs";

export async function readTextFromFile(filePath: string) {
	const file = Bun.file(filePath);
	return await file.text();
}

export async function writeTextToFile(filePath: string, content: string) {
	const file = Bun.file(filePath);
	return await file.write(content);
}

export async function readJsonFromFile(filePath: string): Promise<any> {
	const file = Bun.file(filePath);
	return await file.json();
}

export async function writeJsonToFile(filePath: string, content: any) {
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
