import app from "./app";
import env from "./util/validateEnv";
import mongoose from "mongoose";

const port = env.PORT || 5500;

mongoose
  .connect(env.MONGO_URL)
  .then(() => {
    console.log("MongoDb Connected!");
  })
  .then(() => {
    app.listen(port, () => {
      console.log("App listening on port", +port);
    });
  });