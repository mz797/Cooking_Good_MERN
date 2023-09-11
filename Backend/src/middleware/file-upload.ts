import multer from "multer";
import { v4 } from "uuid";

const MIME_TYPE_MAP = {
	"image/png": "png",
	"image/jpg": "jpg",
	"image/jpeg": "jpeg",
};

const fileUpload = multer({
	limits: { fileSize: 500000000 },
	storage: multer.diskStorage({
		destination: (req, file, cb) => {
			cb(null, "./uploads/images");
		},
		filename: (req, file, cb) => {
			const ext =
				MIME_TYPE_MAP[file.mimetype as keyof typeof MIME_TYPE_MAP];
			cb(null, v4() + "." + ext);
		},
	}),
	fileFilter: (req, file, cb) => {
		const isValid =
			!!MIME_TYPE_MAP[file.mimetype as keyof typeof MIME_TYPE_MAP];
		if (isValid) cb(null, true);
		else cb(new Error("Invalid mime type"));
	},
});

export default fileUpload;
