import mongoose from "mongoose";

const Schema = mongoose.Schema;

const reportSchema = new Schema({
	recipe: {
		type: mongoose.Types.ObjectId,
		ref: "Recipe",
		required: true,
	},
	comment: {
		id: { type: String, required: true },
		content: { type: String, required: true },
		creator: {
			type: mongoose.Types.ObjectId,
			ref: "User",
			required: true,
		},
		reports: [{ type: mongoose.Types.ObjectId, ref: "User" }],
		addedAt: {
			type: Date,
			required: true,
		},
	},
	reportCreator: {
		type: mongoose.Types.ObjectId,
		ref: "User",
		required: true,
	},
});

export default mongoose.model("Report", reportSchema);
