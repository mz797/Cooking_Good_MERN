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
  onDelete,
  sx,
}: myProps) => {
  return (
    <Box sx={sx}>
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
        {recipes.map((item: RecipeType, index: number) => (
          <Recipe key={item._id + index} recipe={item} onDelete={onDelete} />
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
  sx?: object;
  onDelete?: (id: string) => void;
};
