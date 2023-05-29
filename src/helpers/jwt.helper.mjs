import JWT from "jsonwebtoken";
import { config } from "../config/config.mjs";

const signAccessToken = async (user) => {
  const payload = {
    id: user._id,
    name: user.name,
    email: user.email,
  };

  const token = await JWT.sign(payload, config.jwtSecret);
  return token;
};
const verifyJWTToken = async (authToken) => {
  // const token = authToken.split(" ")[1];
  const payload = await JWT.verify(authToken, config.jwtSecret);
  return payload;
};
const verificationToken = async (req, res, next) => {
  const { token } = req.params;
  if (!token) {
    return res
      .status(401)
      .json({ error: { code: 401, message: "token not provided" } });
  }
  try {
    const user = JWT.verify(token, config.jwtSecret);
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

const forgotPasswordToken = async (user) => {
  const payload = {
    id: user._id,
  };
  const token = await JWT.sign(payload, config.jwtSecret, {
    expiresIn: "30m",
  });
  return token;
};

const forgotJwtAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({
      error: { code: 401, message: "Authorization token is required" },
    });
  }
  try {
    const token = authorization.split(" ")[1];
    const user = JWT.verify(token, config.jwtSecret);
    req.forgot_user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const jwtHelper = {
  signAccessToken,
  forgotJwtAuth,
  forgotPasswordToken,
  verifyJWTToken,
  verificationToken,
};
