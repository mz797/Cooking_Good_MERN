import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
  },
  status: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  description: {
    type: String,
  },
  recipes: [{ type: mongoose.Types.ObjectId, required: true, ref: "Recipe" }],
  favorites: [{ type: mongoose.Types.ObjectId, required: true, ref: "Recipe" }],
});

export default mongoose.model("User", userSchema);
