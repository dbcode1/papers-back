const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = () => {
  console.log(`${process.env.MONGO_URI}`);
  try {
    mongoose.connect(`${process.env.MONGO_URI}`, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });

    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
