import { Router } from "express";
import { RecipeType } from "../types/recipe";
import { check, body } from "express-validator";
import checkAuth from "../middleware/check-auth";

import {
	addComment,
	addRate,
	addRecipe,
	deleteRecipe,
	getAllRecipes,
	getSingleRecipe,
	removeComment,
	updateRecipe,
	downloadRecipe,
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
router.delete("/comment/:recipeId/:commentId", removeComment);
router.put("/:recipeId", fileUpload.single("image"), updateRecipe);

router.delete("/:recipeId", deleteRecipe);

export default router;
