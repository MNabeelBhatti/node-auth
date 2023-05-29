import crypto from "crypto";
import { config } from "../config/config.mjs";

const hashPassword = (password) => {
  const key = crypto.pbkdf2Sync(
    password,
    config.passwordSalt,
    100000,
    64,
    "sha512"
  );
  const encryptedPassword = key.toString("hex");
  return encryptedPassword;
};
const comparePassword = (encryptedPassword, password) => {
  const encryptedInput = hashPassword(password);
  return encryptedInput === encryptedPassword;
};
export { hashPassword, comparePassword };
