import { config, server } from "./src/config/index.mjs";

server.listen(process.env.PORT || config.port, () => {
  console.log(`Server Running ON Port ${config.port}`);
});

// Catch unhandled rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection", err);

  console.error("Raven error", err);
  process.exit(1);
});

// Catch uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught exception", err);

  console.error("Raven error", err);
  process.exit(1);
});
