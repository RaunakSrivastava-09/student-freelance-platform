



import mongoose from "mongoose";

const gigSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    price: Number,

   
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Gig ||mongoose.model("Gig", gigSchema);