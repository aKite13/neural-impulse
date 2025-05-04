
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: { type: String, required: true },
    designation: { type: String, default: "" },
    avatar: {
      type: {
        url: { type: String, default: "" },
        public_id: { type: String, default: "" },
      },
      default: {},
    },
    age: { type: String, default: "" },
    location: { type: String, default: "" },
    about: { type: String, default: "" },
    lastSignupDate: { type: Date, default: Date.now }, // Добавлено
  },
  { timestamps: true }
);

export default mongoose.models?.User || mongoose.model("User", UserSchema);