import fs from "fs/promises";

// Get all files from the "src/data/schema" directory
const files = await fs.readdir("src/data/schema", { recursive: true });

files.filter(file => file.endsWith(".schema.ts")).forEach(async (file) => {
	const schemaModule = await import(`src/data/schema/${file}`);
	const generatedCode: Promise<string> = schemaModule.default.call();
	Bun.write(`src/data/object/${file.replace(".schema.ts", ".ts")}`, await generatedCode);
})