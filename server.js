require("dotenv").config();
const express = require("express");

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

const app = express();
const mongoose = require("mongoose");
app.use(require("cors")());
const bodyParser = require("body-parser");
app.use(bodyParser.json());

const userRouter = require("./routes/user");
const billRouter = require("./routes/bill");
app.use(billRouter);
app.use(userRouter);

mongoose.set("strictPopulate", false);

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("db connected");
    app.listen(PORT, () => {
      console.log("Server Started");
    });
  });
