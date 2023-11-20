const { DataBase } = require("../data.json");
const mongoose = require("mongoose");

module.exports = async () => {
  await mongoose.connect(DataBase, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  return mongoose;
};

mongoose.connection.on("connected", () => {
  console.log("(DATABASE) > Successfully connected to the database !");
});
