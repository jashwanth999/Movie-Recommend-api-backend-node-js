const mongoose = require("mongoose");
const user = new mongoose.Schema({
  username: String,
  email: String,
  password: String
});
mongoose.model("ALLUSERS", user);
