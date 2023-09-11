import mongoose from "mongoose";

const Schema = mongoose.Schema;

const recipeSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	image: {
		type: String,
		required: true,
	},
	categories: [
		{
			type: mongoose.Types.ObjectId,
			ref: "Category",
		},
	],
	time: { type: Number, required: true },
	difficulty: { type: Number, required: true },
	ingredients: [
		{
			name: { type: String, required: true },
			amount: { type: String, required: true },
		},
	],
	personCount: { type: Number, required: true },
	shortDescription: { type: String, required: true },
	description: { type: String, required: true },
	creator: {
		type: mongoose.Types.ObjectId,
		ref: "User",
		required: true,
	},
	rates: [
		{
			creator: {
				type: mongoose.Types.ObjectId,
				ref: "User",
				required: true,
			},
			rate: Number,
		},
	],
	comments: [
		{
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
	],
	likes: [
		{
			creator: {
				type: mongoose.Types.ObjectId,
				ref: "User",
				required: true,
			},
		},
	],
	addedAt: {
		type: Date,
		required: true,
	},
	visitCount: {
		type: Number,
		required: true,
	},
});

export default mongoose.model("Recipe", recipeSchema);
