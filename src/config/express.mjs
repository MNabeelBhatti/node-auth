import http from "node:http";
import { fileURLToPath } from "node:url";
import { join, dirname, resolve } from "node:path";
import cors from "cors";
// import helmet from "helmet";
import "./mongoose.mjs";
import express from "express";
import logger from "morgan";
import { errorHandler } from "#middleware";
import router from "#route";
import expressEjsLayouts from "express-ejs-layouts";
import Storage from "node-persist";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
//SocketIO
const app = express(); // Init Express APP

(async () => await Storage.init())();

app.disable("x-powered-by");
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
const server = http.Server(app);
// Set up view engine and layout
app.set("view engine", "ejs");
app.set("layout", "layout/main");
app.use(expressEjsLayouts);
app.use(logger("dev"));
app.use(router);
app.set("views", join(__dirname, "../views"));
// app.use(express.static(join(__dirname, "../views")));
// app.get("*", function (_, res) {
//   res.sendFile(resolve(__dirname, "../../views/main"));
// });

// Error Middleware
app.use(errorHandler.genericErrorHandler);
app.use(errorHandler.methodNotAllowed);

export { server, Storage };
