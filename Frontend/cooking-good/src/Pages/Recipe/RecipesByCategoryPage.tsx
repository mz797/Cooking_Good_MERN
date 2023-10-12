import { Button, Container, Paper, Stack, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Recipe from "../../Components/Recipes/Recipe/Recipe";
import { RecipeType } from "../../types/recipe-types";
import LoadingProgress from "../../Components/common/LoadingProgress";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { loadCategoryDetailsAsync } from "../../store/actions/CategoryActions";

const RecipesByCategoryPage = () => {
  const dispatch = useAppDispatch();
  const { categoryId } = useParams();
  const category = useAppSelector((state) => state.categories.categoryDetails);

  useEffect(() => {
    console.log("dupa");
    if (categoryId) dispatch(loadCategoryDetailsAsync(categoryId));
  }, [categoryId]);

  if (!category) return <LoadingProgress />;
  return (
    <>
      <Paper
        elevation={0}
        sx={{
          height: 300,
          backgroundSize: "cover",
          backgroundImage: `url('http://localhost:8080/${category.image.replace(
            "\\",
            "/"
          )}')`,
          backgroundPosition: "center",

          color: (theme) => theme.palette.text.light,
          textShadow: (theme) => `0 0 10px ${theme.palette.text.dark}`,
        }}
      >
        <Stack
          justifyContent="center"
          alignItems="center"
          spacing={2}
          sx={{
            backdropFilter: " blur(1px)",
            background: "rgba(0,0,0,.1)",
            p: 4,
            width: "100%",
            height: "100%",
          }}
        >
          <Typography variant="h2">{category.name}</Typography>
          <Typography
            sx={{
              fontSize: 20,
              textShadow: (theme) => `0 0 5px ${theme.palette.text.dark}`,
            }}
          >
            Liczba przepisów: {category.recipes.length}
          </Typography>
        </Stack>
      </Paper>
      <Container sx={{ mb: 8, mt: 4, p: 0 }} maxWidth={"xl"}>
        {category.recipes.length > 0 ? (
          <Stack
            direction="row"
            spacing={{ xs: 1, sm: 2 }}
            useFlexGap
            flexWrap="wrap"
          >
            {category.recipes.map((item: RecipeType) => (
              <Recipe key={item._id} recipe={item} />
            ))}
          </Stack>
        ) : (
          <Stack alignItems="center">
            <Typography variant="h4" sx={{ textAlign: "center", mb: 2 }}>
              Ups! W naszej bazie nie ma jeszcze takich przepisów.
            </Typography>
            <Button component={Link} to="/" variant="contained">
              Powrót
            </Button>
          </Stack>
        )}
      </Container>
    </>
  );
};

export default RecipesByCategoryPage;
