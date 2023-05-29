import { authenticate } from "#middleware";
import { Router } from "express";
const router = Router();

import { login } from "../controllers/users.controller.mjs";
import { validator } from "#middleware";
import { userValidation } from "#validation";

router.post("/login", authenticate, login);
router.get("/", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(`<h1>Welcome!</h1>
  <input placeholder="email" />
  `);
});

export default router;
