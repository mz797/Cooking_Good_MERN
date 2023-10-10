import {
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import React from "react";
import { difficultyMarks } from "../AddRecipe/AddRecipeBasic";

const DifficultySection = ({
  handleDifficultySelect,
  selectedDifficulty,
  setStep,
}: myProps) => {
  console.log(selectedDifficulty);
  return (
    <>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Jakiego wyzwania szukasz?
      </Typography>
      {difficultyMarks.map((diff) => (
        <Box
          onClick={(e) => {
            e.preventDefault();
            handleDifficultySelect(diff.value);
          }}
          sx={{
            cursor: "pointer",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "100%",
              p: 1.5,
            }}
          >
            <FormControlLabel
              componentsProps={{ typography: { variant: "h6" } }}
              control={
                <Checkbox
                  checked={
                    selectedDifficulty.filter(
                      (selected) => selected === diff.value
                    ).length === 1
                  }
                />
              }
              label={diff.label}
            />
          </Box>
        </Box>
      ))}
      <Stack direction="row" justifyContent={"center"} sx={{ width: "100%" }}>
        <IconButton
          onClick={() => {
            setStep(0);
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <IconButton
          disabled={selectedDifficulty.length === 0}
          onClick={() => {
            setStep(2);
          }}
        >
          <ArrowForwardIcon />
        </IconButton>
      </Stack>
    </>
  );
};
export default DifficultySection;

type myProps = {
  handleDifficultySelect: (id: number) => void;
  selectedDifficulty: number[];
  setStep: (val: number) => void;
};
