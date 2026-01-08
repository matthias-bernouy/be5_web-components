import { HTTPServer } from "@shared";
import { GET_Component } from "./api/get.component";
import { POST_Component } from "./api/post.componen";
import { Config } from "./core/Config";

export function startRepositoryServer() {
	const server = new HTTPServer({
		port: Config.port,
	});

	server.post("/component", POST_Component);
	server.get("/component/**", GET_Component);

	server.start();
}
