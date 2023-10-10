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
import { timeMarks } from "../AddRecipe/AddRecipeBasic";

const TimeSection = ({ handleTimeSelect, selectedTime, setStep }: myProps) => {
  return (
    <>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Ile masz czasu?
      </Typography>
      {timeMarks.map((diff, idx) =>
        idx % 2 === 1 ? (
          <Box
            onClick={(e) => {
              e.preventDefault();
              handleTimeSelect(diff.value);
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
                      selectedTime.filter((selected) => selected === diff.value)
                        .length == 1
                    }
                  />
                }
                label={diff.label}
              />
            </Box>
          </Box>
        ) : null
      )}
      <Stack direction="row" justifyContent={"center"} sx={{ width: "100%" }}>
        <IconButton
          onClick={() => {
            setStep(1);
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <IconButton
          disabled={selectedTime.length === 0}
          onClick={() => {
            setStep(3);
          }}
        >
          <ArrowForwardIcon />
        </IconButton>
      </Stack>
    </>
  );
};
export default TimeSection;

type myProps = {
  handleTimeSelect: (id: number) => void;
  selectedTime: number[];
  setStep: (val: number) => void;
};
