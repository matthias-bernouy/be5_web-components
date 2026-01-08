import { HTTPServer } from "@shared";
import { CDN } from "./api/cdn";
import { POST_Component } from "./api/post.component";

export function startRepositoryServer() {
	const server = new HTTPServer();

	server.post("/component", POST_Component);
	server.get("/cdn/**", CDN);

	server.start();
}
