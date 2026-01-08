declare module "*.html" {
	const content: string;
	export default content;
}

declare type HTTPRequest = {
	method: string;
	url: string;
	path: string;

	headers: Headers;
	params: Record<string, string>;

	body: {
		txt: () => Promise<string> | undefined;
		json: () => Promise<any> | undefined;
		bytes: () => Promise<Uint8Array> | undefined;
		blob: () => Promise<Blob> | undefined;
	};
};
