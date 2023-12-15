import fs from "fs";

import { Document } from "mongoose";
import { NextFunction, Request, Response } from "express";
import Post from "../models/post";
import HttpError from "../models/http-error";
import { validationResult } from "express-validator";

interface IPost extends Document {
  title: string;
  image: string;
  description: string;
  creator: any;
}

export const getAllPosts = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Post.find()
    .populate("creator", "-password")
    .then((posts: IPost[]) => {
      res.status(200).json({
        message: "Pobrano listę ciekawostek.",
        posts: posts.map((post: IPost) => post.toObject({ getters: true })),
      });
    })
    .catch((err) => {
      const error = new HttpError(
        "Nie udało się pobrać listy ciekawostek",
        500
      );
      return next(error);
    });
};
export const getOnePost = (req: Request, res: Response, next: NextFunction) => {
  const id: string = req.params.postId;

  Post.findById(id)
    .populate("creator", "-password")
    .then((post) => {
      if (!post) {
        const error: HttpError = new HttpError(
          "Nie znaleziono ciekawostki",
          404
        );
        throw error;
      }
      return res.status(200).json({
        message: "Znaleziono ciekawostkę.",
        post: post.toObject({ getters: true }),
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
export const addPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new HttpError(
      "Niepoprawne dane podczas tworzenia ciekawostki.",
      422
    );
    throw error;
  }

  const { title, description, creator } = req.body;

  console.log(req.file?.path.replace("\\", "/"));

  const newPost = new Post({
    title,
    creator,
    description,
    image: req.file?.path.replace("\\", "/"),
    addedAt: new Date(),
  });

  try {
    await newPost.save();
  } catch (err) {
    console.log("newPost", err);
    const error = new HttpError("Nie udało się zapisać ciekawostki.", 500);
    next(error);
  }
  res.status(201).json({
    message: "Dodano nową ciekawostkę",
    post: newPost,
  });
};

export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.postId;

  let post: IPost | null;

  try {
    post = await Post.findById(id);
  } catch (err) {
    console.log(err);
    const error = new HttpError("Błąd wyszukiwania ciekawostki w bazie.", 500);
    return next(error);
  }

  if (!post) {
    const error = new HttpError(
      "Nie znaleziono ciekawostki do usunięcia po ID.",
      404
    );
    return next(error);
  }

  const imagePath = post.image;

  try {
    await post.deleteOne();
  } catch (err) {
    console.log("POST DELETE ", err);
    const error = new HttpError("Nie udało się usunąć ciekawostki.", 500);
    return next(error);
  }

  fs.unlink(imagePath, (err) => {
    console.log("post unlink", err);
  });
  res.status(200).json({ message: "Ciekawostka została usunięta." });
};
