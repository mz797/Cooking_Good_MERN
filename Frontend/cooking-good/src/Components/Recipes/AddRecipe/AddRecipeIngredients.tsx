import {
  Box,
  Button,
  ButtonGroup,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import styled from "styled-components";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddCircleIcon from "@mui/icons-material/AddCircle";

interface Ingredient {
  name: string;
  amount: string;
}

const StyledTextField = styled(TextField)`
  width: 100%;
`;

const AddRecipeIngredients = ({
  register,
  ingredients,
  append,
  remove,
  errors,
}: {
  register: any;
  ingredients: any;
  append: any;
  remove: any;
  errors: any;
}) => {
  useEffect(() => {
    register("ingredients", {
      required: {
        value: true,
        message: "Podaj składniki.",
      },
    });
  }, []);
  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Wprowadz potrzebne składniki wraz z ich ilością:
      </Typography>
      {ingredients.map((ingredient: Ingredient, index: number) => (
        <Grid
          container
          key={index}
          spacing={2}
          sx={{ ml: -2, mb: 2, width: "100%" }}
        >
          <Grid item xs={6}>
            <StyledTextField
              error={!!errors.ingredients?.[index]?.name}
              helperText={errors.ingredients?.[index]?.name?.message}
              label="Nazwa składnika*"
              {...register(`ingredients.${index}.name` as const, {
                required: {
                  value: true,
                  message: "To pole jest wymagane.",
                },
              })}
            />
          </Grid>
          <Grid item xs={4}>
            <StyledTextField
              error={!!errors.ingredients?.[index]?.amount}
              helperText={errors.ingredients?.[index]?.amount?.message}
              label="Ilość*"
              {...register(`ingredients.${index}.amount` as const, {
                required: {
                  value: true,
                  message: "To pole jest wymagane.",
                },
              })}
            />
          </Grid>
          <Grid item xs={2}>
            <ButtonGroup sx={{ height: "100%" }} variant="text">
              <Button
                onClick={() => remove(index)}
                title="Usuń"
                disabled={ingredients.length < 2}
              >
                <DeleteForeverIcon />
              </Button>
              <Button onClick={() => append()} title="Dodaj składnik">
                <AddCircleIcon />
              </Button>
            </ButtonGroup>
          </Grid>
        </Grid>
      ))}
    </Box>
  );
};

export default AddRecipeIngredients;
