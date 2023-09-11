import { Paper, Typography, Box, Stack } from "@mui/material";
import styled from "styled-components";
import { RouterLink } from "../../Navigation";
import { recipeProps } from "../../../types/propTypes/recipeTypes";
import RecipeDifficulty from "./RecipeDifficulty";

import RecipeTime from "./RecipeTime";
import PersonCount from "./PersonCount";
import StarsRating from "../../common/StarsRating";
import { RecipeType } from "../../../types/recipe-types";
import RecipeImage from "./RecipeImage";

const Recipe = ({ recipe }: recipeProps) => {
	return (
		<Paper
			sx={{
				overflow: "hidden",
				minWidth: 200,
				width: { xs: "100%", sm: "48%", md: "32%" },
			}}>
			<RouterLink to={`/recipes/${recipe._id}`}>
				<RecipeImage recipe={recipe} showName />
			</RouterLink>
		</Paper>
	);
};
export default Recipe;
