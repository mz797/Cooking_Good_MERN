import { Router } from "express";
import { add } from "lodash";

import {
	getAllCategories,
	addCategory,
	deleteCategory,
	getOneCategory,
} from "../controllers/category-controller";
import { updateRecipe } from "../controllers/recipe-controller";
import fileUpload from "../middleware/file-upload";

const router = Router();

router.get("/", getAllCategories);

router.get("/:categoryId", getOneCategory);

router.post("/", fileUpload.single("image"), addCategory);

router.delete("/:categoryId", deleteCategory);
export default router;
