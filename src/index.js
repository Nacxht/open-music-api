import Hapi from "@hapi/hapi";

import dotenv from "dotenv";
dotenv.config();

async function main() {
    // Create server
    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ["*"],
            },
        },
    });

    // Register plugins
    await server.register({
        //
    });

    // PreResponse
    server.ext("onPreResponse", (request, h) => {
        //
    });

    // Start server
    server
        .start()
        .then(() => console.log(`Server dijalankan pada ${server.info.uri}`));
}

main();
