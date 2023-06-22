import http from "node:http";
import { fileURLToPath } from "node:url";
import cors from "cors";
// import helmet from "helmet";
import "./mongoose.mjs";
import express from "express";
import logger from "morgan";
import { errorHandler } from "#middleware";
import router from "#route";
import expressEjsLayouts from "express-ejs-layouts";
import Helmet from "helmet";
import cookieParser from "cookie-parser";
import { join, dirname, resolve } from "node:path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
//SocketIO
const app = express(); // Init Express APP

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
app.use(cookieParser());
const server = http.Server(app);
// Set up view engine and layout
app.set("view engine", "ejs");
app.set("layout", "layout/main");
app.use(expressEjsLayouts);
app.use(logger("dev"));
 app.use(express.static(join(process.cwd(), '/public/images/'))) // Serve static files from the 'public' folder
// app.use(express.static("public"))

app.use(router);
app.set("views", join(__dirname, "../views"));
// allow the app to use cookieparser
// app.use(Helmet());

// allow the app to use cookieparser



// app.use(express.static(join(__dirname, "../views")));
// app.get("*", function (_, res) {
//   res.sendFile(resolve(__dirname, "../../views/main"));
// });

// Error Middleware
app.use(errorHandler.genericErrorHandler);
app.use(errorHandler.methodNotAllowed);

export { server };
