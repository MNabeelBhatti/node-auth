import jwt from "jsonwebtoken";
import { config } from "../config/config.mjs";

export const authenticate = async (req, res, next) => {
  const authorization = req.header("Authorization");
  const token = authorization?.split(" ")?.[1];

  if (!token)
    return res
      .status(401)
      .json({ error: { code: 401, message: "token not provided" } });

  try {
    const user = jwt.verify(token, config.jwtSecret);
    req.token_decoded = user;
    next();
  } catch (error) {
    next(error);
  }
};
