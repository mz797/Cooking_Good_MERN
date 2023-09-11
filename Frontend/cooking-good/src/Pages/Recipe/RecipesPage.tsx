import React, { useEffect, useState } from "react";
import { Box, Container, Stack, Typography } from "@mui/material";
import axios from "axios";
import { RecipeType } from "../../types/recipe-types";
import Recipe from "../../Components/Recipes/Recipe/Recipe";
import Header from "../../Components/Recipes/Header";
import CategoryLinks from "../../Components/Category/CategoryLinks";

const RecipesPage = () => {
	const [recipeList, setRecipeList] = useState<RecipeType[] | []>([]);
	useEffect(() => {
		axios.get("http://localhost:8080/recipe/").then((res) => {
			setRecipeList(res.data.recipes);
		});
	}, []);

	return (
		<>
			<Container sx={{ mb: 8, mt: 4, p: 0 }} maxWidth={"xl"}>
				<Typography
					variant="h4"
					sx={{
						textAlign: "center",
						mb: 4,
						color: (theme) => theme.palette.success.main,
					}}>
					Kategorie
				</Typography>
				<CategoryLinks />
			</Container>
			<Box
				sx={{
					width: "100%",
					background: (theme) => theme.palette.background.darker,
				}}>
				<Container
					sx={{ mb: 8, mt: 4, p: 0, py: 1, pb: 5 }}
					maxWidth={"xl"}>
					<Typography
						variant="h4"
						sx={{
							textAlign: "center",
							my: 4,
							color: (theme) => theme.palette.success.main,
						}}>
						Ostatnio dodane
					</Typography>
					<Stack
						direction="row"
						spacing={{ xs: 1, sm: 2 }}
						useFlexGap
						flexWrap="wrap">
						{recipeList.map((item) => (
							<Recipe key={item._id} recipe={item} />
						))}
					</Stack>
				</Container>
			</Box>
		</>
	);
};

export default RecipesPage;
