import { Router } from "express";
import fileUpload from "../middleware/file-upload";
import {
  addPost,
  deletePost,
  getAllPosts,
  getOnePost,
} from "../controllers/post-controller";

const router = Router();

router.get("/", getAllPosts);

router.get("/:postId", getOnePost);

router.post("/", fileUpload.single("image"), addPost);

router.delete("/:postId", deletePost);

export default router;
