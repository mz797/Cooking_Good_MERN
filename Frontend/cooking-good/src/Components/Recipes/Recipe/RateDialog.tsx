import { OpenInBrowserOutlined } from "@mui/icons-material";
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Typography,
} from "@mui/material";
import React, { useState } from "react";

import StarOutlineIcon from "@mui/icons-material/StarOutline";
import StarIcon from "@mui/icons-material/Star";

const RateDialog = ({ open, value, title, onSubmit, onClose }: myProps) => {
	const [hoveredStars, setHoveredStars] = useState(0);
	const totalStars = 5; // Total number of stars

	const handleStarHover = (starIndex: number) => {
		setHoveredStars(starIndex + 1);
	};

	const handleStarClick = (clickedStarIndex: number) => {
		// Handle the rating logic when the user clicks on a star
		setHoveredStars(clickedStarIndex + 1);
	};
	return (
		<Dialog open={open}>
			<DialogTitle>
				Oceń przepis: <b>{title}</b>
			</DialogTitle>
			<DialogContent sx={{ display: "flex", justifyContent: "center" }}>
				<Box>
					{Array.from({ length: totalStars }, (_, index) => (
						<StarIcon
							fontSize="large"
							key={index}
							onMouseEnter={() => handleStarHover(index)}
							onClick={() => handleStarClick(index)}
							color={hoveredStars > index ? "primary" : "inherit"}
						/>
					))}
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Anuluj</Button>
				<Button
					variant="contained"
					onClick={() => onSubmit(hoveredStars)}>
					Zapisz
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default RateDialog;

type myProps = {
	open: boolean;
	value: number;
	title: string;
	onSubmit: (value: number) => void;
	onClose: () => void;
};
