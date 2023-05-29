import { jwtHelper } from "../helpers/jwt.helper.mjs";
import { User } from "../models/index.mjs";
import { hashPassword, comparePassword } from "../helpers/users.helper.mjs";
import { MailService } from "../services/index.mjs";
import { config } from "../config/config.mjs";
import { Storage } from "../config/express.mjs";

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const exists = await User.findOne({ email: email }).lean().exec();
    if (exists) {
      const isMatch = comparePassword(exists.password, password);
      if (isMatch) {
        const token = await jwtHelper.signAccessToken(exists);
        var message = "Successfully Singed In ";
        delete exists.password;

        var responseData = { token: "Bearer " + token, user: exists };
        await Storage.setItem("auth", JSON.stringify(responseData));
        return res.redirect("/home");
        // return res.json({
        //   message,
        //   payload: responseData,
        // });
      } else {
        let err = "Invalid Password";
        return res.status(404).json({ error: { code: 404, message: err } });
      }
    } else {
      let err = "User doesn't exists";
      return res.status(404).json({ error: { code: 404, message: err } });
    }
  } catch (error) {
    next(error);
  }
};
export const signup = async (req, res, next) => {
  try {
    let userData = req.body;
    const checkemail = await User.findOne({ email: userData?.email });
    if (checkemail) {
      let err = "Email already exists";
      return res.status(404).json({ error: { code: 404, message: err } });
    }
    let encryptedPassword = hashPassword(userData.password);
    let newUser = await User.create({
      ...userData,
      password: encryptedPassword,
    });
    let token = await jwtHelper.signAccessToken(newUser);
    delete newUser.password;
    await Storage.setItem(
      "auth",
      JSON.stringify({ user: newUser, token: "Bearer " + token })
    );
    return res.redirect("/home");
    // return res.json({
    //   message: "Signup Successfully!",
    //   payload: { user: newUser, token: "Bearer " + token },
    // });
  } catch (error) {
    next(error);
  }
};
export const logout = async (req, res, next) => {
  try {
    await Storage.clear();
    res.redirect("/");
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    let user = await User.findOne({ email: req.body.email }).lean().exec();
    if (!user) {
      return res.status(401).json({
        error: {
          code: 401,
          message: "Authentication failed. Invalid user.",
        },
      });
    }
    let token = await jwtHelper.forgotPasswordToken(user);
    // let nToken = token.replaceAll(".", "ABC45");
    let link = `${config.base_url}/auth/resetPassword?token=${token}&id=${user._id}`;
    delete user.password;
    let data = { link, user };
    let mailResponse = await MailService.sendResetPasswordMail(data);
    await User.findByIdAndUpdate(user._id, { changePassword: true });
    return res.json({
      message: "email send successfully check your gmail",
      payload: mailResponse,
    });
  } catch (error) {
    next(error);
  }
};

export const resetPasswordLayout = async (req, res, next) => {
  let { token, id } = req.query;
  try {
    let isValidToken = await jwtHelper.verifyJWTToken(token);
    let user = await User.findOne({ _id: id }).lean().exec();
    if (isValidToken && user?.changePassword) {
      res.render("auth/resetPassword", {
        title: "Reset Password",
        user: { token, id },
      });
    } else {
      res.json({ message: "Token invalid or Password already updated!" });
    }
  } catch (error) {
    next(error);
  }
};
export const resetPassword = async (req, res, next) => {
  let { token } = req.query;
  let { password } = req.body;
  let isValidToken = await jwtHelper.verifyJWTToken(token);
  let id = isValidToken.id;
  try {
    let user = await User.findOne({ _id: id }).lean().exec();
    if (user.changePassword) {
      let encryptedPassword = hashPassword(password);
      await User.findByIdAndUpdate(id, {
        changePassword: false,
        password: encryptedPassword,
      });
      res.redirect("/auth/login");
    } else {
      res.json({ message: "Password already updated!" });
    }
  } catch (error) {
    next(error);
  }
};
