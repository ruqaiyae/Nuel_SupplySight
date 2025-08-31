import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import { typeDefs } from "./schema.js";
import { resolvers } from "./resolvers.js";

async function startApolloServer() {
  try {
    const app = express();
    const httpServer = http.createServer(app);
    const PORT = process.env.PORT || 4000;

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });

    await server.start();

    app.use(
      "/graphql",
      cors<cors.CorsRequest>({
        origin: [
          "http://localhost:5173",
          "http://localhost:3000",
          "http://localhost:4173",
        ],
        credentials: true,
      }),
      express.json(),
      expressMiddleware(server, {
        context: async ({ req }) => ({ token: req.headers.token }),
      })
    );

    await new Promise<void>((resolve) =>
      httpServer.listen({ port: PORT }, resolve)
    );
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  } catch (error) {
    console.error("Error starting server:", error);
    throw error;
  }
}

// Run if this file is executed directly
const isMainModule =
  process.argv[1]?.endsWith("server.ts") ||
  process.argv[1]?.endsWith("server.js");
if (isMainModule) {
  startApolloServer()
    .then(() => {
      console.log("Server started successfully!");
    })
    .catch((error) => {
      console.error("Server failed to start:", error);
      process.exit(1);
    });
}

export { startApolloServer };
