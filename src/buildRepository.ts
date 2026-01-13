import { copyFile } from "packages/wc-shared/src/lib/file";

Bun.build({
	entrypoints: ["packages/wc-repository/src/bin.ts"],
	outdir: "build/repository",
	target: "bun",
	minify: true,
});

copyFile(
	"packages/wc-repository/package.json",
	"build/repository/package.json",
);

copyFile("packages/wc-repository/README.md", "build/repository/README.md");
