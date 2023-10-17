import { Box, Container, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../store/store";
import React, { useEffect, useState } from "react";
import { RecipeType } from "../../types/recipe-types";
import RecipeList from "../../Components/Recipes/Recipe/RecipeList";

const PlannerDetails = () => {
  const { date } = useParams();
  const planner = useAppSelector((state) => state.planner.planner);
  const [recipes, setRecipes] = useState<RecipeType[]>([]);

  useEffect(() => {
    const myPlan = planner.find((plan) => plan.date === date);
    if (!!myPlan) setRecipes(myPlan.recipes);
  }, [date]);
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "calc( 100vh - 64px )",
        background: (theme) => theme.palette.background.darker,
      }}
    >
      <Container sx={{ py: 6 }}>
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            mb: 4,
            color: (theme) => theme.palette.success.main,
          }}
        >
          Plan dnia {date?.replaceAll("-", ".")}
        </Typography>
        <RecipeList
          recipes={recipes}
          emptyStateMessage={`Brak przepisów`}
          titleStyles={{ my: 4 }}
        />
      </Container>
    </Box>
  );
};
export default PlannerDetails;
