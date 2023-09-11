import { NextFunction, Request, Response } from "express";
import { Result, ValidationError, validationResult } from "express-validator";
import mongoose, { Document } from "mongoose";
import HttpError from "../models/http-error";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { transporter } from "../config/emailConfig";
import Recipe from "../models/recipe";
import { JWT_KEY } from "../config/configConsts";

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  status: string;
  description: string;
  image: string;
  recipes: mongoose.Types.ObjectId[];
  favorites: mongoose.Types.ObjectId[];
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
}

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let users: IUser[] = [];

  try {
    users = await User.find({}, "-password");
    console.log("getAllUsers", users);
  } catch (err) {
    users = [];
    console.log("getUsers", err);
    const error = new HttpError(
      "Pobieranie użytkowników się nie powiodło",
      400
    );
    return next(error);
  }
  res.status(200).json({
    message: "Pobrano listę użytkowników.",
    users: users.map((user) => user.toObject({ getters: true })),
  });
};

export const getSingleUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId: string = req.params.userId;

  let user: IUser | null;

  try {
    user = await User.findById(userId, "-password").populate("recipes");
  } catch (err) {
    console.log("getSingleUser", err);
    const error: HttpError = new HttpError(
      "Błąd podczas wyszukiwania użytkownika!",
      500
    );
    return next(error);
  }

  if (!user) {
    console.log("getSingleUser");
    const error: HttpError = new HttpError(
      "Nie udało się znależć użytkownika!",
      404
    );
    return next(error);
  }

  res.status(200).json({
    massage: "Znaleziono użytkownika.",
    user: user.toObject({ getters: true }),
  });
};

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const errors: Result = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Niepoprawne dane rejestracji.", 422));
  }

  const { name, email, password, role } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    console.log(err);
    const error: HttpError = new HttpError("Coś poszło nie tak.", 500);
    return next(error);
  }

  if (existingUser) {
    const error: HttpError = new HttpError(
      "Podany email istnieje już w bazie.",
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error: HttpError = new HttpError(
      "Nie udało się stworzyć użytkownika.",
      500
    );
    return next(error);
  }

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    role: "user",
    status: "inactive",
    image: "",
    description: "",
    recipes: [],
    favorites: [],
  });

  try {
    await newUser.save();
  } catch (err) {
    console.log(err);
    const error: HttpError = new HttpError("Nie udało się zarejestrować.", 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    console.log("token");
    const error: HttpError = new HttpError("Nie udało się zarejestrować.", 500);
    return next(error);
  }

  const activationLink = `http://localhost:3000/user/activate/${token}`;
  try {
    const mailOptions = {
      from: "cookinggood.web@gmail.com",
      to: email,
      subject: "Aktywacja konta",
      html: `<span>Kliknij ten link, aby aktywować swoje konto:</span> <a href="${activationLink}" sty>link</a>`,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log("info", info);
  } catch (err) {
    console.log("info error", err);
  }

  res.status(201).json({
    user: {
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      image: newUser.image,
      status: newUser.status,
      description: newUser.description,
      recipes: newUser.recipes,
      favorites: newUser.favorites,
    },
    token: token,
    message: "Użytkownik został zarejestrowany.",
  });
};

export const activateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.params.token;
  const decodedToken: JwtPayload = jwt.verify(
    token,
    JWT_KEY
  ) as JwtPayload;
  console.log(decodedToken);

  const userId = decodedToken.userId;

  try {
    const user: IUser | null = await User.findById(userId);

    if (!user) {
      const error: HttpError = new HttpError("Użytkownik nie istneje.", 404);
      return next(error);
    }

    user.status = "active";
    await user.save();
    res.status(200).json({ message: "Konto zostało pomyślnie aktywowane." });
  } catch (err) {
    console.log("activateUser", err);
    const error: HttpError = new HttpError(
      "Wystąpił błąd podczas aktywacji konta.",
      500
    );
    return next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const errors: Result<ValidationError> = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Nieprawidłowe dane logowania.", 422));
  }

  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email }).populate("recipes");
  } catch (err) {
    console.log(err);
    const error: HttpError = new HttpError("Nie udało się zalogować.", 500);
    return next(error);
  }

  if (!existingUser) {
    const error: HttpError = new HttpError(
      "Nieprawidłowy e-mail lub hasło",
      403
    );
    return next(error);
  }

  let isValidPassword: boolean = false;

  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error: HttpError = new HttpError(
      "Nie udało się zalogować. Proszę sprawdz poprawność danych.",
      401
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error: HttpError = new HttpError(
      "Nieprawidłowy e-mail lub hasło",
      401
    );
    return next(error);
  }
  if (isValidPassword && existingUser.status === "inactive") {
    const error: HttpError = new HttpError(
      "To konto jest nieaktywne. Sprawdz swoją pocztę.",
      401
    );
    return next(error);
  }

  let token;

  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    console.log("token");
    const error: HttpError = new HttpError("Nie udało się zalogować.", 500);
    return next(error);
  }

  res.json({
    user: {
      userId: existingUser.id,
      email: existingUser.email,
      name: existingUser.name,
      role: existingUser.role,
      image: existingUser.image,
      status: existingUser.status,
      description: existingUser.description,
      recipes: existingUser.recipes,
      favorites: existingUser.favorites,
    },
    token: token,
  });
};

export const updateUserStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.userId;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error: HttpError = new HttpError(
      "Niepoprawne dane podczas edycji użytkownika.",
      422
    );
    throw error;
  }

  const { status } = req.body;

  let user: IUser | null;
  try {
    user = await User.findById(id);
  } catch (err) {
    console.log("updateUserStatus", err);
    const error: HttpError = new HttpError(
      "Nie udało się znależć użytkownika do edycji!",
      500
    );
    return next(error);
  }

  if (!user) {
    const error: HttpError = new HttpError(
      "Nie udało się znależć użytkownika do edycji!",
      404
    );
    return next(error);
  }

  user.status = status;

  try {
    await user.save();
  } catch (err) {
    console.log("updateUserStatus", err);
    const error: HttpError = new HttpError(
      "Zmiana statusu nie powiodła się!",
      500
    );
    return next(error);
  }

  res.status(200).json({
    massage: "Zmianiono status użytkownika",
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      image: user.image,
      status: user.status,
      description: user.description,
      favorites: user.favorites,
    },
  });
};
export const updateUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.userId;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error: HttpError = new HttpError(
      "Niepoprawne dane podczas edycji użytkownika.",
      422
    );
    throw error;
  }

  const { role } = req.body;

  let user: IUser | null;
  try {
    user = await User.findById(id);
  } catch (err) {
    console.log("updateUserRole", err);
    const error: HttpError = new HttpError(
      "Nie udało się znależć użytkownika do edycji!",
      500
    );
    return next(error);
  }

  if (!user) {
    const error: HttpError = new HttpError(
      "Nie udało się znależć użytkownika do edycji!",
      404
    );
    return next(error);
  }

  user.role = role;

  try {
    await user.save();
  } catch (err) {
    console.log("updateUserRole", err);
    const error: HttpError = new HttpError(
      "Zmiana statusu nie powiodła się!",
      500
    );
    return next(error);
  }

  res.status(200).json({
    massage: "Zmieniono rolę użytkownika",
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      image: user.image,
      status: user.status,
      description: user.description,
      favorites: user.favorites,
    },
  });
};
export const updateUserImage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id: string = req.params.userId;

  const errors: Result<ValidationError> = validationResult(req);
  if (!errors.isEmpty()) {
    const error: HttpError = new HttpError(
      "Nie poprawne dane podczas edycji zdjęcia.",
      422
    );
    throw error;
  }

  let user: IUser | null;

  try {
    user = await User.findById(id).populate("recipes");
  } catch (err) {
    console.log("updateUserImage", err);
    const error: HttpError = new HttpError(
      "Nie udało się znależć użytkownika do edycji!",
      500
    );
    return next(error);
  }

  if (!user) {
    const error: HttpError = new HttpError(
      "Nie udało się znależć użytkownika do edycji!",
      404
    );
    return next(error);
  }

  if (req.file) {
    user.image = req.file.path.replace("\\", "/");
    try {
      await user.save();
    } catch (err) {
      console.log("updateUserImage", err);
      const error: HttpError = new HttpError(
        "Nie udało się zapisać zjęcia.",
        500
      );
      next(error);
    }
  }

  res.status(200).json({
    message: "Zaktualizowano zdjęcia użytkownika",
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      image: user.image,
      status: user.status,
      description: user.description,
      recipes: user.recipes,
      favorites: user.favorites,
    },
  });
};
export const updateUserDescription = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id: string = req.params.userId;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error: HttpError = new HttpError(
      "Niepoprawne dane podczas edycji użytkownika.",
      422
    );
    throw error;
  }

  const { description } = req.body;

  let user: IUser | null;
  try {
    user = await User.findById(id).populate("recipes");
  } catch (err) {
    console.log("updateUserRole", err);
    const error: HttpError = new HttpError(
      "Nie udało się znależć użytkownika do edycji!",
      500
    );
    return next(error);
  }

  if (!user) {
    const error: HttpError = new HttpError(
      "Nie udało się znależć użytkownika do edycji!",
      404
    );
    return next(error);
  }

  user.description = description;

  try {
    await user.save();
  } catch (err) {
    console.log("updateUserRole", err);
    const error: HttpError = new HttpError(
      "Zmiana opisu nie powiodła się!",
      500
    );
    return next(error);
  }

  res.status(200).json({
    massage: "Zmieniono opis użytkownika",
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      image: user.image,
      status: user.status,
      description: user.description,
      recipes: user.recipes,
      favorites: user.favorites,
    },
  });
};

export const addToFavorites = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId: string = req.params.userId;
  const recipeId: string = req.params.recipeId;

  let user: IUser | null;
  try {
    user = await User.findById(userId);
  } catch (err) {
    console.log("addToFavorites", err);
    const error: HttpError = new HttpError(
      "Nie udało się znależć użytkownika!",
      500
    );
    return next(error);
  }

  if (!user) {
    const error: HttpError = new HttpError(
      "Nie udało się znależć użytkownika!",
      404
    );
    return next(error);
  }

  let recipe: IRecipe | null;

  try {
    recipe = await Recipe.findById(recipeId)
      .populate("creator", "name image")
      .populate("categories")
      .populate("comments.creator");
  } catch (err) {
    console.log("addToFavourites", err);
    const error: HttpError = new HttpError(
      "Nie udało się znależć przepisu!",
      500
    );
    return next(error);
  }
  if (!recipe) {
    const error: HttpError = new HttpError(
      "Nie udało się znależć przepisu!",
      404
    );
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();

    await user.favorites.push(recipe._id);
    await user.save({ session: sess });

    await recipe.likes.push({ creator: user._id });
    await recipe.save({ session: sess });

    await sess.commitTransaction();
  } catch (err) {
    console.log("addToFavorite", err);
    const error = new HttpError(
      "Nie udało się dodać przepisu do ulubionych.",
      500
    );
    return next(error);
  }

  res.status(200).json({
    massage: "Dodano przepis do ulubionych.",
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      image: user.image,
      status: user.status,
      description: user.description,
      recipes: user.recipes,
      favorites: user.favorites,
    },
    recipe: recipe.toObject({ getters: true }),
  });
};

export const deleteFromFavorites = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId: string = req.params.userId;
  const recipeId: string = req.params.recipeId;

  let user: IUser | null;
  try {
    user = await User.findById(userId);
  } catch (err) {
    console.log("addToFavorites", err);
    const error: HttpError = new HttpError(
      "Nie udało się znależć użytkownika!",
      500
    );
    return next(error);
  }

  if (!user) {
    const error: HttpError = new HttpError(
      "Nie udało się znależć użytkownika!",
      404
    );
    return next(error);
  }

  let recipe: IRecipe | null;

  try {
    recipe = await Recipe.findById(recipeId)
      .populate("creator", "name image")
      .populate("categories")
      .populate("comments.creator");
  } catch (err) {
    console.log("addToFavourites", err);
    const error: HttpError = new HttpError(
      "Nie udało się znależć przepisu!",
      500
    );
    return next(error);
  }
  if (!recipe) {
    const error: HttpError = new HttpError(
      "Nie udało się znależć przepisu!",
      404
    );
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();

    user.favorites = user.favorites.filter(
      (favorite) => favorite.toString() !== recipe?._id.toString()
    );
    console.log("USERRRR", user.favorites);
    await user.save({ session: sess });

    recipe.likes = recipe.likes.filter(
      (like) => like.creator.toString() !== user?._id.toString()
    );

    console.log("REEECIPEEEE", recipe.likes);
    await recipe.save({ session: sess });

    await sess.commitTransaction();
  } catch (err) {
    console.log("addToFavorite", err);
    const error = new HttpError(
      "Nie udało się usunąć przepisu do ulubionych.",
      500
    );
    return next(error);
  }

  res.status(200).json({
    massage: "Usunięto przepis z ulubionych",
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      image: user.image,
      status: user.status,
      description: user.description,
      recipes: user.recipes,
      favorites: user.favorites,
    },
    recipe: recipe.toObject({ getters: true }),
  });
};
