import { Document } from "mongoose";
import { NextFunction, Request, Response } from "express";
import { Result, validationResult } from "express-validator";
import HttpError from "../models/http-error";
import Newsletter from "../models/newsletter";
import { transporter } from "../config/emailConfig";

interface INewsletter extends Document {
  email: string;
}

export const addToNewsletter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new HttpError(
      "Niepoprawne dane podczas zapisywania się na newsletter.",
      422
    );
    throw error;
  }

  const { email } = req.body;

  let existingNewsletter;
  try {
    existingNewsletter = await Newsletter.findOne({ email: email });
  } catch (err) {
    console.log(err);
    const error: HttpError = new HttpError("Coś poszło nie tak.", 500);
    return next(error);
  }

  if (existingNewsletter) {
    const error: HttpError = new HttpError(
      `Email ${email} jest już zapisany na newsletter`,
      422
    );
    return next(error);
  }

  const newNewsletter = new Newsletter({ email });

  try {
    await newNewsletter.save();
  } catch (err) {
    console.log(err);
    const error: HttpError = new HttpError(
      "Nie udało się zapisać na newsletter.",
      500
    );
    return next(error);
  }
  res.status(201).json({ message: `Dodano email '${email}' do newslettera.` });
};

export const sendNewsletter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors: Result = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Niepoprawne dane podczas próby wysłania newslettera.", 422)
    );
  }

  const { content, title } = req.body;

  let newsletters: INewsletter[] | [];

  try {
    newsletters = await Newsletter.find();
  } catch (err) {
    console.log("sendNewsletter", err);
    const error: HttpError = new HttpError(
      "Błąd podczas pobrania użytkowników zapisanych na newsletter.",
      500
    );
    return next(error);
  }

  if (!newsletters) {
    console.log("sendNewsletter");
    const error: HttpError = new HttpError(
      "Nie udało się pobrać użytkowników zapisanych na newsletter.",
      404
    );
    return next(error);
  }

  try {
    const mailOptions = {
      from: "cookinggood.web@gmail.com",
      to: newsletters.map((n) => n.email),
      subject: title,
      html: content,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log("info", info);
  } catch (err) {
    console.log("info error", err);
    const error: HttpError = new HttpError(
      "Błąd podczas wysyłania newslettera.",
      500
    );
    return next(error);
  }
  res.status(200).json({
    massage: "Wysłano newsletter.",
  });
};
