import { Box, Divider, Stack, Typography } from "@mui/material";
import Recipe from "./Recipe";
import EmptyState from "../../common/EmptyState";
import React from "react";
import { RecipeType } from "../../../types/recipe-types";

const RecipeList = ({
  title,
  recipes,
  emptyStateMessage,
  divider,
  titleStyles,
}: myProps) => {
  return (
    <Box>
      {!!title && (
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            color: (theme) => theme.palette.success.main,
            ...titleStyles,
          }}
        >
          {title}
        </Typography>
      )}
      {divider && <Divider sx={{ my: 3 }} />}
      <Stack
        direction="row"
        spacing={{ xs: 1, sm: 2 }}
        useFlexGap
        flexWrap="wrap"
      >
        {recipes.map((item: RecipeType) => (
          <Recipe key={item._id} recipe={item} />
        ))}
        {recipes.length === 0 && <EmptyState message={emptyStateMessage} />}
      </Stack>
    </Box>
  );
};
export default RecipeList;

type myProps = {
  title?: string;
  recipes: RecipeType[];
  emptyStateMessage: string;
  divider?: boolean;
  titleStyles?: object;
};
