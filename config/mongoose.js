const mongoose = require("mongoose");

//connecting mongoose with database

const DB = process.env.MONGODB_URI;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connection successful!");
  })
  .catch((err) => console.log("no connection " + err));

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Error in connecting to Mongodb"));

db.once("open", function () {
  console.log(`Connnected to Database: Mongodb`);
});

module.exports = db;
