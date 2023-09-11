import { timeMarks } from "../AddRecipe/AddRecipeBasic";

import React from "react";
import TimelapseIcon from "@mui/icons-material/Timelapse";
import { Box, Typography } from "@mui/material";

const RecipeTime = ({ time, sx }: myProps) => {
	const timeMark = timeMarks.find((mark) => mark.value === time);

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
			}}>
			<TimelapseIcon />
			<Typography>{timeMark ? timeMark.label : ""}</Typography>
		</Box>
	);
};

export default RecipeTime;

type myProps = {
	time: number;
	sx?: Object;
};
