import { System } from "src/data/object/System";

export function HTTPServer(){

    Bun.serve({
        port: System.find(0).port,
        fetch(request: Request) {
            return new Response("Hello from Bun HTTP Server!");
        },
    });

}