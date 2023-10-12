import { RecipeType } from "../../../types/recipe-types";
import { useEffect, useState } from "react";
import { CircularProgress, Paper, Stack, Typography } from "@mui/material";
import RecipeImage from "../Recipe/RecipeImage";
import { RouterLink } from "../../Navigation";

const WinnerSection = ({ recipe }: myProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Stack justifyContent="center" alignItems="center">
      {isLoading && <CircularProgress />}
      {!!recipe && !isLoading && (
        <Paper
          sx={{
            overflow: "hidden",
            minWidth: 200,
          }}
        >
          {
            <RouterLink to={`/recipes/${recipe._id}`}>
              <RecipeImage recipe={recipe} showName />
            </RouterLink>
          }
        </Paper>
      )}
      {!recipe && !isLoading && (
        <Typography>
          Niestety nie udało nam się znaleźć przepisu odpowiadającego twoim
          kryteriom. Spróbuj jeszcze raz.
        </Typography>
      )}
    </Stack>
  );
};
export default WinnerSection;

type myProps = {
  recipe: RecipeType;
};
