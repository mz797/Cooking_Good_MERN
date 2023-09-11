import fs from "fs";

import { Response, Request, NextFunction } from "express";
import { validationResult } from "express-validator";
import HttpError from "../models/http-error";
import mongoose, { Document, Model } from "mongoose";
import Category from "../models/category";
import Recipe from "../models/recipe";
interface ICategory extends Document {
	name: string;
	image: string;
	recipes: any;
}
interface IRecipe extends Document {
	name: string;
	image: string;
	categories: any;
	time: number;
	difficulty: number;
	ingredients: {
		name: string;
		amount: string;
	}[];
	description: string;
	shortDescription: string;
	creator: any;
	addedAt: Date;
	rates: { creator: any; rate: number }[];
}

export const getAllCategories = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	Category.find()
		.then((categories) => {
			res.status(200).json({
				message: "Pobrano listę kategorii",
				categories: categories.map((category) =>
					category.toObject({ getters: true })
				),
			});
		})
		.catch((err) => {
			console.log("getAllCategories", err);
			const error = new HttpError(
				"Nie udało się pobrać listy kategorii",
				500
			);
			return next(error);
		});
};

export const getOneCategory = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const id = req.params.categoryId;

	Category.findById(id)
		.populate({
			path: "recipes",
			populate: { path: "creator" }, // Populate the creator field of recipes
		})
		.then((category) => {
			if (!category) {
				const error = new HttpError("Nie znaleziono kategorii", 404);
				throw error;
			}
			return res.status(200).json({
				message: "Znaleziono kategorię.",
				category: category.toObject({ getters: true }),
			});
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};

export const addCategory = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		const error = new HttpError(
			"Niepoprawne dane podczas tworzenia kategorii.",
			422
		);
		throw error;
	}

	const { name } = req.body;

	console.log(req.file?.path.replace("\\", "/"));
	const newCategory = new Category({
		name,
		image: req.file?.path.replace("\\", "/"),
	});

	try {
		await newCategory.save();
	} catch (err) {
		console.log("addCategory", err);
		const error = new HttpError("Nie udało się zapisać kategorii.", 500);
		next(error);
	}
	res.status(201).json({
		message: "Dodano nową kategorię",
		category: newCategory,
	});
};

export const deleteCategory = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const id = req.params.categoryId;

	let category: ICategory | null;

	try {
		category = await Category.findById(id).populate("recipes");
	} catch (err) {
		console.log(err);
		const error = new HttpError(
			"Błąd wyszukiwania categorii w bazie.",
			500
		);
		return next(error);
	}

	if (!category) {
		const error = new HttpError(
			"Nie znaleziono kategorii do usunięcia po ID.",
			404
		);
		return next(error);
	}

	const imagePath = category.image;

	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();

		await category.deleteOne({ session: sess });

		for (const recipe of category.recipes) {
			recipe.categories.pull(category._id);
			await recipe.save({ sesstin: sess });
		}

		await sess.commitTransaction();
	} catch (err) {
		console.log("CATEGORY DELETE TRANSACTION", err);
		const error = new HttpError("Nie udało się usunąć kategorii.", 500);
		return next(error);
	}

	fs.unlink(imagePath, (err) => {
		console.log("category unlink", err);
	});
	res.status(200).json({ message: "Kategoria została usunięta." });
};
