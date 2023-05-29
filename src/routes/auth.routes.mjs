import { Router } from "express";
const router = Router();
import { validator } from "#middleware";
import { userValidation } from "#validation";
import { userController } from "#controller";
router.post("/login", userController.login);
router.get("/login", (req, res) => {
  res.render("auth/login", { title: "Login" });
});
router.get("/forgetPassword", (req, res) => {
  res.render("auth/forgetPassword", { title: "Forget Password" });
});
router.get("/resetPassword", userController.resetPasswordLayout);
router.get("/register", (req, res) => {
  res.render("auth/register", { title: "Register" });
});
router.get("/logout", userController.logout);
//@route    POST auth/signup
//@desc     Sign up user (create user account)
//@access   Public

router.post("/forgotPassword", userController.forgotPassword);
router.post("/resetPassword", userController.resetPassword);

router.post(
  "/signup",
  validator(userValidation.createUser),
  userController.signup
);

export default router;
