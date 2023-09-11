import mongoose from "mongoose";
import { config } from "./config";

export default () => {
  const connect = () => {
    console.log("connecting to DB....");
    mongoose
      .connect(`${config.DATABASE_URL}`)
      .then(() => {
        console.log("succesefully connected to DB");
      })
      .catch((error) => {
        console.log("ERROR: Connected to DB", error);
        return process.exit(1);
      });
  };
  connect();

  mongoose.connection.on("Disconnected", connect);
};
