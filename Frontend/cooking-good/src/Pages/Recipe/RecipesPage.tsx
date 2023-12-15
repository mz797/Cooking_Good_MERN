import React, { useEffect, useState } from "react";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import CategoryLinks from "../../Components/Category/CategoryLinks";
import RecipeList from "../../Components/Recipes/Recipe/RecipeList";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch, useAppSelector } from "../../store/store";
import NewsletterForm from "../../Components/NewsletterForm";
import EastIcon from "@mui/icons-material/East";
import { Link } from "react-router-dom";
import LotterySection from "../../Components/Recipes/Lottery/LotterySection";
import { loadRecipes } from "../../store/actions/RecipesActions";
import { RecipeType } from "../../types/recipe-types";
import dayjs from "dayjs";

const RecipesPage = () => {
  const dispatch = useAppDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const recipes = useAppSelector((state) => state.recipes.recipesList);
  const [recipeList, setRecipeList] = useState<RecipeType[]>([...recipes]);

  useEffect(() => {
    setRecipeList([...recipes]);
  }, [recipes]);

  useEffect(() => {
    dispatch(loadRecipes());
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
        {recipeList.length > 0 && (
          <Container sx={{ mt: 4, p: 0, py: 1, pb: 5 }} maxWidth={"xl"}>
            <RecipeList
              title="Ostatnio dodane"
              recipes={recipeList
                .sort((a, b) => (dayjs(a.addedAt).isBefore(b.addedAt) ? 1 : -1))
                .slice(0, 6)}
              emptyStateMessage={`Brak przepisów`}
              titleStyles={{ my: 4 }}
            />
            <Stack alignItems="end" sx={{ mt: 1 }}>
              <Button
                endIcon={<EastIcon />}
                component={Link}
                to="/recipes-list"
              >
                Zobacz wszystkie
              </Button>
            </Stack>
          </Container>
        )}
      </Box>
      <LotterySection />
      <Box
        sx={{
          width: "100%",
        }}
      >
        {recipeList.length > 0 && (
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
            <Stack alignItems="end" sx={{ mt: 1 }}>
              <Button
                endIcon={<EastIcon />}
                component={Link}
                to="/recipes-list"
              >
                Zobacz wszystkie
              </Button>
            </Stack>
          </Container>
        )}
      </Box>
      <Box
        sx={{
          width: "100%",
          background: (theme) => theme.palette.background.darker,
        }}
      >
        {recipeList.length > 0 && (
          <Container sx={{ mt: 4, p: 0, py: 1, pb: 5 }} maxWidth={"xl"}>
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
            <Stack alignItems="end" sx={{ mt: 1 }}>
              <Button
                endIcon={<EastIcon />}
                component={Link}
                to="/recipes-list"
              >
                Zobacz wszystkie
              </Button>
            </Stack>
          </Container>
        )}
      </Box>
      <NewsletterForm email={!!user ? user.email : undefined} />
    </>
  );
};

export default RecipesPage;
