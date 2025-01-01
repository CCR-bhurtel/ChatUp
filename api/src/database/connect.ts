import mongoose from "mongoose";
import { DATABASE } from "../config/keys";
import logger from "../logger/winston.logger";

const connect = async (): Promise<void> => {
  await mongoose.connect(DATABASE, {});
  logger.info("Database Connected Successfully...");
};

export default connect;
