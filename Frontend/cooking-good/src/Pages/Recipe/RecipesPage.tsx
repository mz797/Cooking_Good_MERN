import React, { useEffect, useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import axios from "axios";
import { RecipeType } from "../../types/recipe-types";
import CategoryLinks from "../../Components/Category/CategoryLinks";
import RecipeList from "../../Components/Recipes/Recipe/RecipeList";

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
          }}
        >
          Kategorie
        </Typography>
        <CategoryLinks />
      </Container>
      <Box
        sx={{
          width: "100%",
          background: (theme) => theme.palette.background.darker,
        }}
      >
        <Container sx={{ mb: 4, mt: 4, p: 0, py: 1, pb: 5 }} maxWidth={"xl"}>
          <RecipeList
            title="Ostatnio dodane"
            recipes={recipeList}
            emptyStateMessage={`Brak przepisów`}
            titleStyles={{ my: 4 }}
          />
        </Container>
      </Box>
      <Box
        sx={{
          width: "100%",
        }}
      >
        <Container sx={{ mb: 4, mt: 4, p: 0, py: 1, pb: 5 }} maxWidth={"xl"}>
          <RecipeList
            title="Najczęściej odwiedzane"
            recipes={recipeList
              .sort(
                (a: RecipeType, b: RecipeType) => b.visitCount - a.visitCount
              )
              .slice(0, 3)}
            emptyStateMessage={`Brak przepisów`}
            titleStyles={{ my: 4 }}
          />
        </Container>
      </Box>
      <Box
        sx={{
          width: "100%",
          background: (theme) => theme.palette.background.darker,
        }}
      >
        <Container sx={{ mb: 4, mt: 4, p: 0, py: 1, pb: 5 }} maxWidth={"xl"}>
          <RecipeList
            title="Najbardziej lubiane"
            recipes={recipeList
              .sort(
                (a: RecipeType, b: RecipeType) =>
                  b.likes.length - a.likes.length
              )
              .slice(0, 3)}
            emptyStateMessage={`Brak przepisów`}
            titleStyles={{ my: 4 }}
          />
        </Container>
      </Box>
    </>
  );
};

export default RecipesPage;
