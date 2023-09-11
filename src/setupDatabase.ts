import mongoose from "mongoose";

export default () => {
  const connect = () => {
    console.log("connecting to DB....");
    mongoose
      .connect("mongodb://127.0.0.1:27017/chat-app-backend")
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
