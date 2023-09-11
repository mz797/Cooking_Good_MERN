import {
	Box,
	Button,
	Container,
	Paper,
	Stack,
	Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Recipe from "../../Components/Recipes/Recipe/Recipe";
import { ICategory } from "../../types/category-types";
import { RecipeType } from "../../types/recipe-types";

const RecipesByCategoryPage = () => {
	const { categoryId } = useParams();
	const [category, setCategory] = useState<ICategory | null>(null);

	useEffect(() => {
		axios
			.get(`http://localhost:8080/category/${categoryId}`)
			.then((res) => setCategory(res.data.category))
			.catch((err) => console.log(err));
	}, [categoryId]);
	return (
		<>
			{!!category ? (
				<>
					<Paper
						elevation={0}
						sx={{
							height: 250,
							backgroundSize: "cover",
							backgroundImage: `url('http://localhost:8080/uploads/images/category-recipe.png')`,
							backgroundPosition: "center",
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
							alignItems: "center",
							p: 4,
						}}>
						<Typography variant="h2">{category.name}</Typography>
						<Typography>
							{category.recipes.length} przepisów
						</Typography>
					</Paper>
					<Container sx={{ mb: 8, mt: 4, p: 0 }} maxWidth={"xl"}>
						{category.recipes.length > 0 ? (
							<Stack
								direction="row"
								spacing={{ xs: 1, sm: 2 }}
								useFlexGap
								flexWrap="wrap">
								{category.recipes.map((item: RecipeType) => (
									<Recipe key={item._id} recipe={item} />
								))}
							</Stack>
						) : (
							<Stack alignItems="center">
								<Typography
									variant="h4"
									sx={{ textAlign: "center", mb: 2 }}>
									Ups! W naszej bazie nie ma jeszcze takich
									przepisów.
								</Typography>
								<Button
									component={Link}
									to="/"
									variant="contained">
									Powrót
								</Button>
							</Stack>
						)}
					</Container>
				</>
			) : (
				<Typography>Nie ma takich przepisów</Typography>
			)}
		</>
	);
};

export default RecipesByCategoryPage;
