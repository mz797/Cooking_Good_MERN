import fs from "fs";
import path from "path";
import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

import recipesRoutes from "./routes/recipes-routes";
import usersRoutes from "./routes/users-routes";
import categoryRoutes from "./routes/category-routes";
import reportRoutes from "./routes/reports-routes";
import postRoutes from "./routes/posts-routes";
import newsletterRoutes from "./routes/newsletter-router";
import HttpError from "./models/http-error";
import { CONNECTION_STRING } from "./config/configConsts";

const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

app.use(
  "/uploads/images",
  express.static(path.join(process.cwd(), "/uploads/images"))
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, DELETE, PATCH"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/newsletter", newsletterRoutes);
app.use("/users", usersRoutes);
app.use("/category", categoryRoutes);
app.use("/recipe", recipesRoutes);
app.use("/report", reportRoutes);
app.use("/post", postRoutes);

app.use((req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log("[app.ts]", err);
    });
  }
  const error = new HttpError("Nie ma takiej ścieżki", 404);
  throw error;
});

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.log(error);
  if (res.headersSent) {
    return next(error);
  }
  const status = error.code || 500;
  const message = error.message || "Nieznany błąd.";
  res.status(status).json({ message });
});

mongoose
  .connect(CONNECTION_STRING)
  .then((result) => {
    app.listen(8080);
    console.log("Connected!");
  })
  .catch((err) => console.log(err));
