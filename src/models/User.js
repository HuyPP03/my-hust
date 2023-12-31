import mongoose, { Schema, models } from "mongoose";
const userSchema = new Schema(
  {
    name: {
      type: String,
      // required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    image: {
      type: String,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    admin: {
      type: Boolean,
      default: false,
    },
    resetToken: {
      type: String,
      required: false,
    },
    resetTokenExpires: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true }
);
const User = models.User || mongoose.model("User", userSchema);
export default User;
