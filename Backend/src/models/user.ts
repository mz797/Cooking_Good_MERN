import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    required: true,
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
  shoppingList: [
    {
      name: { type: String, required: true },
      amount: { type: String, required: true },
    },
  ],
  serviceId: { type: String },
  recipes: [{ type: mongoose.Types.ObjectId, required: true, ref: "Recipe" }],
  favorites: [{ type: mongoose.Types.ObjectId, required: true, ref: "Recipe" }],
  planner: [
    {
      date: { type: String, required: true },
      recipes: [
        { type: mongoose.Types.ObjectId, required: true, ref: "Recipe" },
      ],
    },
  ],
});

export default mongoose.model("User", userSchema);
