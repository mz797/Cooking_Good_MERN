import { Box, Container, Typography } from "@mui/material";
import RecipeList from "../../Components/Recipes/Recipe/RecipeList";
import React, { useEffect, useState } from "react";
import { RecipeType } from "../../types/recipe-types";
import axios from "axios";
import { ICategory } from "../../types/category-types";
import RecipeFilters from "../../Components/Recipes/Recipe/RecipeFilters";

const RecipesListPage = () => {
  const [recipeList, setRecipeList] = useState<RecipeType[] | []>([]);
  const [categoriesList, setCategoriesList] = useState<ICategory[] | []>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<RecipeType[] | []>([]);

  useEffect(() => {
    axios.get("http://localhost:8080/recipe").then((res) => {
      setRecipeList(res.data.recipes);
    });

    axios.get("http://localhost:8080/category").then((res) => {
      setCategoriesList(res.data.categories);
    });
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        background: (theme) => theme.palette.background.darker,
      }}
    >
      <Container sx={{ p: 0, py: 2, pb: 8 }} maxWidth={"xl"}>
        <Typography
          variant="h4"
          sx={{
            my: 3,
            textAlign: "center",
            color: (theme) => theme.palette.success.main,
          }}
        >
          Przepisy
        </Typography>
        <RecipeFilters
          categoriesList={categoriesList}
          recipeList={recipeList}
          onFilter={(recipes: RecipeType[]) => setFilteredRecipes(recipes)}
        />
        <RecipeList
          recipes={filteredRecipes}
          emptyStateMessage={`Brak przepisów`}
          titleStyles={{ my: 4 }}
        />
      </Container>
    </Box>
  );
};
export default RecipesListPage;
