import { Router } from "express";
import { check } from "express-validator";

import {
  activateUser,
  addToFavorites,
  addToPlanner,
  addToShoppingList,
  deleteFromFavorites,
  deleteFromShoppingList,
  downloadShoppingList,
  getSingleUser,
  getUserPlanner,
  getUsers,
  login,
  loginWithFacebook,
  signup,
  updateUserDescription,
  updateUserImage,
  updateUserRole,
  updateUserStatus,
} from "../controllers/users-controller";
import fileUpload from "../middleware/file-upload";

const router = Router();

router.get("/", getUsers);
router.get("/:userId", getSingleUser);
router.get("/activate/:token", activateUser);
router.get("/add-favorite/:userId/:recipeId", addToFavorites);
router.get("/delete-favorite/:userId/:recipeId", deleteFromFavorites);

router.put("/status/:userId", updateUserStatus);
router.put("/role/:userId", updateUserRole);
router.put("/image/:userId", fileUpload.single("image"), updateUserImage);
router.put("/description/:userId", updateUserDescription);

router.post("/planner/:userId/:recipeId", addToPlanner);
router.get("/planner/:userId", getUserPlanner);

router.put("/shopping-list/:userId", addToShoppingList);
router.delete("/shopping-list/:userId", deleteFromShoppingList);
router.get("/shopping-list/download/:userId", downloadShoppingList);

router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  signup
);

router.post("/login", [check("email").normalizeEmail().isEmail()], login);
router.post("/facebook/login", loginWithFacebook);

export default router;
