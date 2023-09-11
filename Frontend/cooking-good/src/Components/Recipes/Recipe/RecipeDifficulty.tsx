import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import EggAltOutlinedIcon from "@mui/icons-material/EggAltOutlined";
import EggAltIcon from "@mui/icons-material/EggAlt";

const RecipeDifficulty = ({ difficulty }: myProps) => {
	if (difficulty === 1)
		return (
			<Stack alignItems="center">
				<Box display="flex">
					<EggAltIcon />
					<EggAltOutlinedIcon />
					<EggAltOutlinedIcon />
				</Box>
				<Typography variant="button">Łatwy</Typography>
			</Stack>
		);
	if (difficulty === 2)
		return (
			<Stack alignItems="center">
				<Box display="flex">
					<EggAltIcon />
					<EggAltIcon />
					<EggAltOutlinedIcon />
				</Box>
				<Typography variant="button">Średni</Typography>
			</Stack>
		);
	else
		return (
			<Stack alignItems="center">
				<Box display="flex">
					<EggAltIcon />
					<EggAltIcon />
					<EggAltIcon />
				</Box>
				<Typography variant="button">Trudny</Typography>
			</Stack>
		);
};

export default RecipeDifficulty;

interface myProps {
	difficulty: number;
}
