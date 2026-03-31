
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["buyer", "seller"], default: "buyer" },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", userSchema);