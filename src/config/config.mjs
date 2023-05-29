import Joi from "joi";
// require and configure dotenv, will load vars in .env in PROCESS.ENV
import * as dotenv from "dotenv";
dotenv.config();
const envVarsSchema = Joi.object({
  // General variable validations
  APP_NAME: Joi.string().default("api development"),
  APP_VERSION: Joi.string().default("1.0.0"),
  BASE_URL: Joi.string().default("http://localhost:8080"),
  // Server setup validations
  PORT: Joi.number().default(4040),
  HOST: Joi.string().default("127.0.0.1"),
  // Secret validations to sign the token for emails and jwt
  JWT_SECRET: Joi.string()
    .required()
    .description("JWT Secret required to sign"),
  PASSWORD_SALT: Joi.string()
    .required()
    .description("Password generation secret required"),
  // Database details validations
  MONGOOSE_DEBUG: Joi.boolean().when("NODE_ENV", {
    is: Joi.string().equal("development"),
    then: Joi.boolean().default(true),
    otherwise: Joi.boolean().default(false),
  }),
  MONGO_DB_URI: Joi.string().required().description("Mongo DB host url"),
  DB_NAME: Joi.string().required().description("DB name required"),
})
  .unknown()
  .required();
const { error, value: envVars } = envVarsSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}
export const config = {
  appName: envVars.APP_NAME,
  appVersion: envVars.APP_VERSION,
  port: envVars.PORT,
  host: envVars.HOST,
  passwordSalt: envVars.PASSWORD_SALT,
  jwtSecret: envVars.JWT_SECRET,
  mongooseDebug: envVars.MONGOOSE_DEBUG,
  mongoUrl: envVars.MONGO_DB_URI,
  base_url: envVars.BASE_URL,
  db_name: envVars.DB_NAME,
};
