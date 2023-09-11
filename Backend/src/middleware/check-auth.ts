import { Response, NextFunction, Request } from "express";
import HttpError from "../models/http-error";
import jwt, { JwtPayload } from "jsonwebtoken";
import { merge } from "lodash";
import { JWT_KEY } from "../config/configConsts";

const checkAuth = (req: Request, res: Response, next: NextFunction) => {
	if (req.method === "OPTIONS") {
		return next();
	}
	try {
		const token = req.headers?.authorization?.split(" ")[1];
		console.log("checkAuth", token);
		if (!token) {
			throw new Error("Nieudana Autentykacja.");
		}
		const decodedToken = jwt.verify(token, JWT_KEY) as JwtPayload;

		merge(req, { userData: { userId: decodedToken.userId } });
		next();
	} catch (err) {
		const error = new HttpError("Nieudana Autentykacja.", 403);
		return next(error);
	}
};
export default checkAuth;
