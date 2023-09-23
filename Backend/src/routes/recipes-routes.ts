import { Router } from "express";
import checkAuth from "../middleware/check-auth";

import {
  addComment,
  addCommentImage,
  addRate,
  addRecipe,
  deleteCommentImage,
  deleteRecipe,
  downloadRecipe,
  getAllRecipes,
  getSingleRecipe,
  removeComment,
  updateRecipe,
} from "../controllers/recipe-controller";
import fileUpload from "../middleware/file-upload";

const router = Router();

router.get("/", getAllRecipes);

router.get("/:recipeId", getSingleRecipe);

router.get("/download/:recipeId", downloadRecipe);

//middleware sprawdz czy mamy token
router.use(checkAuth);

router.post("/", fileUpload.single("image"), addRecipe);

router.put("/rate/:recipeId", addRate);
router.put("/comment/:recipeId", addComment);
router.put(
  "/comment-image/:recipeId",
  fileUpload.single("image"),
  addCommentImage
);
router.delete("/comment-image/:recipeId/:imageId", deleteCommentImage);
router.delete("/comment/:recipeId/:commentId", removeComment);
router.put("/:recipeId", fileUpload.single("image"), updateRecipe);

router.delete("/:recipeId", deleteRecipe);

export default router;
