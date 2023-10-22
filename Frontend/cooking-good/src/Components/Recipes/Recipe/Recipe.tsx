import { Box, IconButton, Paper } from "@mui/material";
import { RouterLink } from "../../Navigation";
import { recipeProps } from "../../../types/propTypes/recipeTypes";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import RecipeImage from "./RecipeImage";

const Recipe = ({ recipe, onDelete }: recipeProps) => {
  if (!!onDelete)
    return (
      <Box
        sx={{
          position: "relative",
          minWidth: 200,
          width: { xs: "100%", sm: "48%", md: "32%" },
          height: 320,
        }}
      >
        <Paper
          sx={{
            overflow: "hidden",
            width: "100%",
            position: "absolute",
            top: 0,
            right: 0,
          }}
        >
          <RouterLink to={`/recipes/${recipe._id}`}>
            <RecipeImage recipe={recipe} showName />
          </RouterLink>
        </Paper>
        <IconButton
          sx={{ position: "absolute", top: 0, left: 0 }}
          onClick={() => onDelete(recipe._id)}
        >
          <DeleteForeverIcon color="error" />
        </IconButton>
      </Box>
    );
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
