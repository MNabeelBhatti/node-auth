import mongoose from "mongoose";
import { config } from "./config.mjs";
try {
  mongoose.set("strictQuery", false);
  await mongoose.connect(config.mongoUrl + config.db_name, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("db connected");
} catch (error) {
  console.log(error.message);
}
