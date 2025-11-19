import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: "String",
    require: true,
  },
  email: {
    type: "String",
    require: true,
    unique: true,
  },
  password: {
    type: "String",
    require: true,
  },

  credits: {
    type: "Number",
    default: 20,
  },
});

export default mongoose.model("User", UserSchema);
