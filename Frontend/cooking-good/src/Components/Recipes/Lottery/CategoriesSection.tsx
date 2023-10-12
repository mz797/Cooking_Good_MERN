import { ICategory } from "../../../types/category-types";
import {
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Masonry } from "@mui/lab";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import React from "react";

const CategoriesSection = ({
  handleCategorySelect,
  categories,
  selectedCategories,
  step,
  setStep,
}: myProps) => {
  return (
    <>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Jaki posiłek Ciebie interesuje? Wybierz maksymalnie 3 kategorie.
      </Typography>
      <Masonry columns={2} spacing={1}>
        {categories.map((c: ICategory) => (
          <Box
            onClick={(e) => {
              e.preventDefault();
              handleCategorySelect(c.id);
            }}
            sx={{
              cursor: "pointer",
              borderRadius: 4,
              overflow: "hidden",
              backgroundColor: (theme) => theme.palette.primary.main,
              p: 1,
            }}
          >
            <FormControlLabel
              componentsProps={{ typography: { variant: "h6" } }}
              sx={{
                color: (theme) => theme.palette.text.light,
                textShadow: (theme) => `0 0 10px ${theme.palette.text.dark}`,
              }}
              control={
                <Checkbox
                  sx={{
                    color: (theme) => theme.palette.text.light,
                    "&.Mui-checked": {
                      color: (theme) => theme.palette.text.light,
                    },
                  }}
                  checked={!!selectedCategories.find((cId) => cId === c.id)}
                />
              }
              label={c.name}
            />
          </Box>
        ))}
      </Masonry>
      <Stack direction="row" justifyContent={"center"} sx={{ width: "100%" }}>
        <IconButton disabled={step === 0}>
          <ArrowBackIcon />
        </IconButton>
        <IconButton
          disabled={selectedCategories.length === 0}
          onClick={() => {
            setStep(1);
          }}
        >
          <ArrowForwardIcon />
        </IconButton>
      </Stack>
    </>
  );
};
export default CategoriesSection;

type myProps = {
  handleCategorySelect: (id: string) => void;
  categories: ICategory[];
  selectedCategories: string[];
  step: number;
  setStep: (val: number) => void;
};
