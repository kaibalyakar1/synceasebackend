const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    uid: String,
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    photoURL: String,
    displayName: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
