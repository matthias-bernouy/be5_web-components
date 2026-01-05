export type ManifestType = {
	namespace: string;
	tag: string;
	version: string;

	htmlFile: string;
	cssFile: string;
	jsFile: string;

	previewFile: string;
	components: Record<string, string>;
};
