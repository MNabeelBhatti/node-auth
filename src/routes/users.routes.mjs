import { authenticate } from "#middleware";
import { Router } from "express";
const router = Router();

import { login } from "../controllers/users.controller.mjs";
import { validator } from "#middleware";
import { userValidation } from "#validation";

export default router;
