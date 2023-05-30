import { Router } from "express";
import userRoutes from "./users.routes.mjs";
import authRoutes from "./auth.routes.mjs";
import { Storage } from "../config/express.mjs";
const router = Router();
router.get("/", async (req, res) => {
  res.render("index", { title: "Landing" });
});
router.get("/home", async (req, res) => {
  let item = await Storage.getItem("auth");
  let auth = JSON.parse(item || "{}");
  console.log(Storage);
  if (auth?.token) {
    res.render("home", { title: "Home", user: auth?.user });
  } else {
    res.redirect("/");
  }
});
//Authenticated
router.use("/users", userRoutes);
router.use("/auth", authRoutes);
export default router;
