import mongoose from "mongoose";

const Schema = mongoose.Schema;

const categorySchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	image: {
		type: String,
		required: true,
	},
	recipes: [{ type: mongoose.Types.ObjectId, ref: "Recipe" }],
});

export default mongoose.model("Category", categorySchema);
