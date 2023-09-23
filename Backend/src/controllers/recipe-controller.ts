import fs from "fs";

import puppeteer from "puppeteer";

import { RecipeType } from "../types/recipe";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

import Recipe from "../models/recipe";
import User from "../models/user";
import Category from "../models/category";
import Report from "../models/report";
import HttpError from "../models/http-error";

import mongoose, { Document } from "mongoose";
import { ICategory } from "../types/category";

const ObjectId = mongoose.Types.ObjectId;

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role?: string;
  recipes: mongoose.Types.ObjectId[];
  shoppingList: { name: string; amount: string }[];
}

interface IRecipe extends Document {
  name: string;
  image: string;
  categories: mongoose.Types.ObjectId[];
  time: number;
  difficulty: number;
  ingredients: {
    name: string;
    amount: string;
  }[];
  description: string;
  personCount: number;
  shortDescription: string;
  creator: any;
  addedAt: Date;
  rates: { creator: any; rate: number }[];
  comments: { id: string; content: string; creator: any }[];
  likes: { creator: any }[];
  visitCount: number;
  commentImages: { image: string; creator: any; addedAt: Date }[];
}

type RequestParams = { recipeId: string };

export const getAllRecipes = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Recipe.find()
    .populate("creator", "name")
    .populate("categories", "name")
    .then((recipes) => {
      res.status(200).json({
        message: "Pobrano listę przepisów",
        recipes: recipes.map((recipe) => recipe.toObject({ getters: true })),
      });
    })
    .catch((err) => {
      console.log("getAllRecipes", err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

export const getSingleRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const params = req.params as RequestParams;
  const id = params.recipeId;

  let recipe: IRecipe | null;

  try {
    recipe = await Recipe.findById(id)
      .populate("creator", "name image")
      .populate("categories")
      .populate("comments.creator")
      .populate("commentImages.creator");
  } catch (err) {
    console.log("getSingleRecipe", err);
    const error = new HttpError("Błąd podczas wyszukiwania przepisu!", 500);
    return next(error);
  }

  if (!recipe) {
    console.log("getSingleRecipe");
    const error = new HttpError("Nie udało się znależć przepisu!", 404);
    return next(error);
  }

  recipe.visitCount = recipe.visitCount + 1;
  try {
    await recipe.save();
  } catch (err) {
    console.log("getSingleRecipe", err);
    const error = new HttpError(
      "Nie udało się zwiększyć liczby odwiedzin!",
      404
    );
    return next(error);
  }

  return res.status(200).json({
    message: "Znaleziono przepis",
    recipe: recipe.toObject({ getters: true }),
  });
};

export const addRate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.recipeId;
  const { rate } = req.body;

  let recipe;

  try {
    recipe = await Recipe.findById(id)
      .populate("creator", "name image")
      .populate("categories")
      .populate("comments.creator")
      .populate("commentImages.creator");
  } catch (err) {
    console.log("addRate", err);
    const error = new HttpError(
      "Nie udało się znależć przepisu do oceny!",
      500
    );
    return next(error);
  }

  if (!recipe) {
    console.log("addRate");
    const error = new HttpError(
      "Nie udało się znależć przepisu do oceny!",
      404
    );
    return next(error);
  }
  let rates;

  if (recipe.rates.length > 0) {
    recipe.rates = [
      ...recipe.rates.filter((r) => {
        console.log(r.creator, rate.creator);

        return r.creator.toString() !== rate.creator.toString();
      }),
      rate,
    ];
  } else {
    recipe.rates = [rate];
  }

  try {
    await recipe.save();
  } catch (err) {
    console.log("addRate", err);
    const error = new HttpError("Dodanie oceny się nie powiodło", 500);
    return next(error);
  }
  let updatedRecipe;
  try {
    updatedRecipe = await recipe.populate("creator", "name");
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Nie udało się pobrać przepisu po edycji.",
      500
    );
    return next(error);
  }
  res.status(200).json({
    message: "Dodano ocenę",
    recipe: updatedRecipe.toObject({ getters: true }),
  });
};

export const addComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.recipeId;
  const { comment } = req.body;

  let recipe;

  try {
    recipe = await Recipe.findById(id)
      .populate("creator", "name image")
      .populate("categories")
      .populate("comments.creator")
      .populate("commentImages.creator");
  } catch (err) {
    console.log("addComent", err);
    const error = new HttpError(
      "Nie udało się znależć przepisu do dodania komentarza!",
      500
    );
    return next(error);
  }

  if (!recipe) {
    console.log("addComent");
    const error = new HttpError(
      "Nie udało się znależć przepisu do dodania komentarza!",
      404
    );
    return next(error);
  }

  recipe.comments.push(comment);

  try {
    await recipe.save();
  } catch (err) {
    console.log("addComment save", err);
    const error = new HttpError("Dodanie komentarza się nie powiodło.", 500);
    return next(error);
  }

  let updatedRecipe;
  try {
    updatedRecipe = await recipe.populate("comments.creator");
  } catch (err) {
    console.log(err);

    const error = new HttpError(
      "Nie udało się pobrać przepisu po edycji.",
      500
    );
    return next(error);
  }

  res.status(200).json({
    message: "Dodano komentarz",
    recipe: updatedRecipe.toObject({ getters: true }),
  });
};

export const removeComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { recipeId, commentId } = req.params;

  let recipe: IRecipe | null;
  let reports: any[];

  try {
    recipe = await Recipe.findById(recipeId)
      .populate("creator", "name image")
      .populate("categories")
      .populate("comments.creator")
      .populate("commentImages.creator");
  } catch (err) {
    console.log("removeComment", err);

    const error = new HttpError("Błąd wyszukiwania przepisu w bazie.", 500);
    return next(error);
  }

  if (!recipe) {
    const error = new HttpError("Nie znaleziono przepisu w bazie.", 404);
    return next(error);
  }

  recipe.comments = recipe.comments.filter(
    (comment) => comment.id !== commentId
  );

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();

    await Report.deleteMany({ "comment.id": commentId }, { session: sess });

    await recipe.save();

    await sess.commitTransaction();
  } catch (err) {
    console.log("delete comment", err);
    const error = new HttpError("Nie udało się usunąć komentarza.", 500);
    next(error);
  }

  res.status(200).json({
    message: "Usunięto komentarz",
    recipe: recipe.toObject({ getters: true }),
  });
};

export const addRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new HttpError("Niepoprawne dane dodawania przepisu.", 422);
    throw error;
  }
  const {
    name,
    time,
    difficulty,
    description,
    creator,
    personCount,
    shortDescription,
  } = req.body;
  let { ingredients, categories } = req.body;

  ingredients = JSON.parse(ingredients);
  categories = JSON.parse(categories);

  const newCategories: ICategory[] = [];

  for (const category of categories) {
    let foundCategory: ICategory | null;

    try {
      foundCategory = await Category.findById(category);
    } catch (err) {
      console.log("finding category", err);
      const error = new HttpError("Błąd podczas szukania kategorii.", 500);
      return next(error);
    }

    if (!foundCategory) {
      console.log("finding category");
      const error = new HttpError(
        "Nie udało się znależć podanej kategorii.",
        500
      );
      return next(error);
    }
    newCategories.push(foundCategory);
  }

  const newRecipe = new Recipe({
    name,
    image: req.file?.path.replace("\\", "/"),
    categories,
    shortDescription,
    time,
    difficulty,
    ingredients,
    description,
    personCount,
    creator,
    visitCount: 0,
    likes: [],
    comments: [],
    commentImages: [],
    rates: [],
    addedAt: new Date(),
  });

  let user: IUser | null;

  try {
    user = await User.findById(creator);
  } catch (err) {
    console.log("finding user form recipe", err);
    const error = new HttpError(
      "Błąd podczas tworzenia przepisu dla danego użytkownika.",
      500
    );
    return next(error);
  }
  if (!user) {
    console.log("Nie ma takiego usera!");
    const error = new HttpError(
      "Nie udało się znaleźć danego użytkownika.",
      404
    );
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await newRecipe.save({ session: sess });

    for (const category of newCategories) {
      category.recipes.push(newRecipe._id);
      await category.save({ session: sess });
    }

    user.recipes.push(newRecipe._id);
    await user.save({ session: sess, validateModifiedOnly: true });
    await sess.commitTransaction();
  } catch (err) {
    console.log("addRecipe transaction", err);
    const error = new HttpError("Nie udało się zapisać przepisu.", 500);
    next(error);
  }

  res.status(201).json({
    message: "Added recipe",
    recipe: newRecipe,
  });
};

export const updateRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const body = req.body as RecipeType;
  const params = req.params as RequestParams;
  const id = params.recipeId;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError(
      "Niepoprawne dane podczas dodawania przepisu.",
      422
    );
    throw error;
  }

  const { name, time, difficulty, description, personCount, shortDescription } =
    req.body;
  let { ingredients, categories } = req.body;
  const newImage = req.file?.path;

  ingredients = JSON.parse(ingredients);
  categories = JSON.parse(categories);

  let recipe: IRecipe | null;
  try {
    recipe = await Recipe.findById(id);
  } catch (err) {
    console.log("updateRecipe", err);
    const error = new HttpError(
      "Nie udało się znależć przepisu do edycji!",
      500
    );
    return next(error);
  }

  if (!recipe) {
    const error = new HttpError(
      "Nie udało się znależć przepisu do edycji!",
      404
    );
    return next(error);
  }

  console.log(recipe.creator);
  if (recipe.creator.toString() !== req.userData.userId) {
    const error = new HttpError(
      "Nie masz uprawnień do edycji tego przepisu.",
      401
    );
    return next(error);
  }
  const oldImage = recipe?.image;

  for (const category of recipe.categories) {
    const foundCategory = await Category.findById(category);
    if (foundCategory) {
      const categoryId = foundCategory._id as mongoose.Types.ObjectId;
      foundCategory.recipes = foundCategory.recipes.filter(
        (cRecipe) => cRecipe.toString() !== recipe?._id.toString()
      );
      await foundCategory.save();
    }
  }

  recipe.name = name;
  recipe.categories = categories;
  recipe.time = time;
  recipe.shortDescription = shortDescription;
  recipe.personCount = personCount;
  recipe.difficulty = difficulty;
  recipe.ingredients = ingredients;
  recipe.description = description;
  if (!!newImage) {
    recipe.image = newImage.replace("\\", "/");
    fs.unlink(oldImage, (err) => {
      console.log("unlink", err);
    });
  }

  for (const category of categories) {
    const foundCategory = await Category.findById(category);
    if (foundCategory) {
      foundCategory.recipes.push(recipe._id);
      await foundCategory.save();
    }
  }
  try {
    await recipe.save();
  } catch (err) {
    console.log("updatePlace", err);
    const error = new HttpError("Edycja nie powiodła się!", 500);
    return next(error);
  }

  res.status(200).json({
    message: "Zaktualizowano przepis",
    recipe: recipe.toObject({ getters: true }),
  });
};

export const deleteRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const params = req.params as RequestParams;
  const id = params.recipeId;

  let user: IUser | null;
  let recipe: IRecipe | null;

  try {
    recipe = await Recipe.findById(id).populate("creator");
  } catch (err) {
    console.log("deletePlace", err);
    const error = new HttpError("Błąd wyszukiwania przepisu w bazie.", 500);
    return next(error);
  }

  if (!recipe) {
    const error = new HttpError(
      "Nie znaleziono przepisu do usunięcia po ID.",
      404
    );
    return next(error);
  }
  if (recipe.creator.id !== req.userData.userId) {
    const error = new HttpError(
      "Nie masz uprawnień do usunięcia tego przepisu.",
      401
    );
    return next(error);
  }

  for (const category of recipe.categories) {
    const foundCategory = await Category.findById(category);
    if (foundCategory) {
      const categoryId = foundCategory._id as mongoose.Types.ObjectId;
      foundCategory.recipes = foundCategory.recipes.filter(
        (cRecipe) => cRecipe.toString() !== recipe?._id.toString()
      );
      await foundCategory.save();
    }
  }

  const imagePath = recipe.image;
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await recipe.deleteOne({ session: sess });

    recipe.creator.recipes.pull(recipe._id);

    await recipe.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log("delete transaction", err);
    const error = new HttpError("Nie udało się usunąć przepisu.", 500);
    return next(error);
  }

  fs.unlink(imagePath, (err) => {
    console.log("unlink", err);
  });
  res.status(200).json({ message: "Przepis został usunięty." });
};

export const downloadRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const recipeId: string = req.params.recipeId;

  let recipe: RecipeType | null;

  try {
    recipe = await Recipe.findById(recipeId);

    if (!recipe) {
      return next(new HttpError("Nie znależiono przepisu.", 404));
    }

    const recipeName = `recipe-${recipeId}.pdf`;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const html = `<div><h1 style="margin-bottom: 12px;
		text-align:center;
		word-break: break-word;
		font-weight: 500;
		letter-spacing: 0.7">${recipe.name}</h1>
		<hr/>
		<img src='http://localhost:8080/${recipe.image.replace(
      "\\",
      "/"
    )}' style="width: 100%;
		object-fit: cover;
		height: 320px;" ></img>
		<h2 style="color:#30b470;text-align:center;">Składniki</h2>
		${recipe.ingredients
      .map(
        (
          ingredient
        ) => `<div style="width:100%; display:flex; justify-content:space-between; border-bottom:1px solid #999;letter-spacing: '1px'; padding:8px:text-transform:uppercase;">
		<span>${ingredient.name}</span>
		<span>${ingredient.amount}</span>
		</div>`
      )
      .join("")}
			<h2 style="color:#30b470;text-align:center;">Przepis</h2>
		${recipe.description}</div>`;

    await page.setContent(html);

    const pdfBuffer = await page.pdf({
      format: "A4",
      margin: { left: "1cm", top: "1cm", right: "1cm", bottom: "2cm" },
    });

    await browser.close();

    res.contentType("application/pdf");
    res.send(pdfBuffer);
  } catch (err) {
    console.log("PDF", err);
    const error = new HttpError("Wystąpił błąd podczas generowania PDF.", 500);
    return next(error);
  }

  // const pdfDoc = new PDFDocument();
  // pdfDoc.pipe(fs.createWriteStream(recipePath));
  // pdfDoc.pipe(res);
  // console.log(recipe.description);

  // pdfDoc.text(recipe.description);

  // pdfDoc.end();
  //
  // const file = fs.createReadStream(recipePath);
  // file.pipe(res);
};

export const addCommentImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id: string = req.params.recipeId;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new HttpError("Niepoprawne dane dodawania przepisu.", 422);
    throw error;
  }
  const { creator } = req.body;

  let recipe: IRecipe | null;

  try {
    recipe = await Recipe.findById(id)
      .populate("comments.creator.name")
      .populate("creator", "name image")
      .populate("categories", "name");
  } catch (err) {
    console.log("addCommentImage", err);
    const error = new HttpError(
      "Nie udało się znależć przepisu do dodania zdjęcia!",
      500
    );
    return next(error);
  }

  if (!recipe) {
    console.log("addCommentImage");
    const error = new HttpError(
      "Nie udało się znależć przepisu do dodania zdjęcia!",
      404
    );
    return next(error);
  }
  if (req.file)
    recipe.commentImages.push({
      image: req.file.path.replace("\\", "/"),
      creator,
      addedAt: new Date(),
    });

  try {
    await recipe.save();
  } catch (err) {
    console.log("addCommentImages save", err);
    const error = new HttpError("Dodanie zdjęcia się nie powiodło.", 500);
    return next(error);
  }

  let updatedRecipe;
  try {
    updatedRecipe = await recipe.populate("commentImages.creator");
  } catch (err) {
    console.log(err);

    const error = new HttpError(
      "Nie udało się pobrać przepisu po edycji.",
      500
    );
    return next(error);
  }

  res.status(200).json({
    message: "Dodano zdjęcie",
    recipe: updatedRecipe.toObject({ getters: true }),
  });
};

export const deleteCommentImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const recipeId: string = req.params.recipeId;
  const imageId: string = req.params.imageId;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new HttpError("Niepoprawne dane dodawania przepisu.", 422);
    throw error;
  }

  let recipe: IRecipe | null;

  try {
    recipe = await Recipe.findById(recipeId)
      .populate("comments.creator.name")
      .populate("creator", "name image")
      .populate("categories", "name");
  } catch (err) {
    console.log("deleteCommentImage", err);
    const error = new HttpError("Nie udało się znależć przepisu!", 500);
    return next(error);
  }

  if (!recipe) {
    console.log("deleteCommentImage");
    const error = new HttpError(
      "Nie udało się znależć przepisu do dodania zdjęcia!",
      404
    );
    return next(error);
  }

  console.log();
  recipe.commentImages = recipe.commentImages.filter(
    (image) => image.toString() !== imageId.toString()
  );

  try {
    await recipe.save();
  } catch (err) {
    console.log("deleteCommentImage save", err);
    const error = new HttpError("Usunięcie zdjęcia się nie powiodło.", 500);
    return next(error);
  }

  let updatedRecipe;
  try {
    updatedRecipe = await recipe.populate("commentImages.creator");
  } catch (err) {
    console.log(err);

    const error = new HttpError(
      "Nie udało się pobrać przepisu po edycji.",
      500
    );
    return next(error);
  }

  res.status(200).json({
    message: "Usunięto zdjęcie",
    recipe: updatedRecipe.toObject({ getters: true }),
  });
};
