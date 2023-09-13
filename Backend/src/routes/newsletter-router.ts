import { Router } from "express";
import {
  addToNewsletter,
  sendNewsletter,
} from "../controllers/newsletter-controller";

const router = Router();

router.post("/", addToNewsletter);
router.post("/send", sendNewsletter);

export default router;
