import {
	Avatar,
	Box,
	Button,
	ButtonGroup,
	Container,
	Paper,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddCategory from "../../../Components/Category/AddCategory";
import { ICategory } from "../../../types/category-types";
import { RecipeType } from "../../../types/recipe-types";

const RecipesTable = () => {
	const { categoryId } = useParams();
	console.log(categoryId);

	const [category, setCategory] = useState<ICategory | null>(null);

	useEffect(() => {
		axios
			.get(`http://localhost:8080/category/${categoryId}`)
			.then((res) => setCategory(res.data.category))
			.catch((err) => console.log(err));
	}, [categoryId]);
	// const handleCategoryDelete = (recipeId: string) => {
	// 	axios
	// 		.delete(`http://localhost:8080/recipe/${recipeId}`)
	// 		.then((res) => {
	// 			if (res.status === 200) {
	// 				setRecipes((prev) => prev.filter((c) => c.id !== recipeId));
	// 			}
	// 		})
	// 		.catch((err) => {
	// 			console.log(err);
	// 		});
	// };

	return (
		<Container sx={{ mt: 4 }}>
			<TableContainer component={Paper}>
				<Typography variant="h3">
					{!!category && category.name}
				</Typography>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Np.</TableCell>
							<TableCell>Nazwa</TableCell>
							<TableCell>Autor</TableCell>
							<TableCell>Obraz</TableCell>
							<TableCell>Akcje</TableCell>
						</TableRow>
					</TableHead>
					{!!category && category.recipes.length > 0 && (
						<TableBody>
							{category.recipes.map((recipe, index) => (
								<TableRow key={recipe.id}>
									<TableCell>{index + 1}</TableCell>
									<TableCell>{recipe.name}</TableCell>
									<TableCell>{recipe.creator.name}</TableCell>
									<TableCell>
										<Avatar
											sx={{ width: 60, height: 60 }}
											variant="rounded"
											src={`http://localhost:8080/${recipe.image}`}
										/>{" "}
									</TableCell>
									<TableCell>
										<ButtonGroup>
											<Button>Pokaż przepis</Button>
										</ButtonGroup>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					)}
				</Table>
			</TableContainer>
		</Container>
	);
};

export default RecipesTable;
