import { Router } from "express";
import {
	addReport,
	getAllReports,
	deleteReport,
} from "../controllers/report-controller";
import checkAuth from "../middleware/check-auth";

const router = Router();

router.get("/", getAllReports);

router.post("/", addReport);

router.delete("/:reportId", deleteReport);

export default router;
