import { Response, Request, NextFunction } from "express";
import { validationResult } from "express-validator";
import HttpError from "../models/http-error";
import mongoose, { Document, Model } from "mongoose";
import Category from "../models/category";
import Recipe from "../models/recipe";
import Report from "../models/report";

export const getAllReports = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	Report.find()
		.populate("comment.creator")
		.populate("recipe")
		.then((reports) => {
			console.log(reports);
			res.status(200).json({
				message: "Pobrano zgłoszone komentarze",
				reports: reports.map((r) => r.toObject({ getters: true })),
			});
		})
		.catch((err) => {
			console.log("getAllReports", err);

			const error = new HttpError(
				"Nie udało się pobrać listy zgłoszonych komentarzy",
				500
			);
			return next(error);
		});
};

export const addReport = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		const error = new HttpError(
			"Niepoprawne dane podczas tworzenia kategorii.",
			422
		);
		throw error;
	}

	const { comment, recipe, reportCreator } = req.body;

	const newReport = new Report({
		comment,
		recipe,
		reportCreator,
	});

	try {
		await newReport.save();
	} catch (err) {
		console.log("addReport", err);
		const error = new HttpError("Nie udało się zgłosić komentarza.", 500);
		next(error);
	}

	res.status(201).json({
		message: "Zgłoszono komentarz.",
		report: newReport,
	});
};

export const deleteReport = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const id = req.params.reportId;

	let report: any;

	try {
		report = Report.findById(id);
	} catch (err) {
		console.log("deleteReport", err);

		const error = new HttpError(
			"Błąd wyszukiwania zgłoszenia w bazie.",
			500
		);
		return next(error);
	}

	if (!report) {
		const error = new HttpError(
			"Nie znaleziono zgłoszenia do usunięcia po ID.",
			404
		);
		return next(error);
	}

	try {
		await report.deleteOne();
	} catch (err) {
		console.log("deleteReport report.deleteOne", err);

		const error = new HttpError("Nie udało się usunąć zgłoszenia.", 500);
		return next(error);
	}

	res.status(200).json({ message: "Zgłoszenie zostało usunięte." });
};
