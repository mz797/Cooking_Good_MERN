import { Paper } from "@mui/material";
import { RouterLink } from "../../Navigation";
import { recipeProps } from "../../../types/propTypes/recipeTypes";

import RecipeImage from "./RecipeImage";

const Recipe = ({ recipe }: recipeProps) => {
  return (
    <Paper
      sx={{
        overflow: "hidden",
        minWidth: 200,
        width: { xs: "100%", sm: "48%", md: "32%" },
      }}
    >
      <RouterLink to={`/recipes/${recipe._id}`}>
        <RecipeImage recipe={recipe} showName />
      </RouterLink>
    </Paper>
  );
};
export default Recipe;
