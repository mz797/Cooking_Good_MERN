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

const popularityMarks = [
  { value: 1, label: "Znane i popularne" },
  { value: 2, label: "Ukryte perełki" },
];
const PopularitySection = ({ handleSelect, selected, setStep }: myProps) => {
  return (
    <>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Na co masz ochotę?
      </Typography>
      {popularityMarks.map((diff) => (
        <Box
          onClick={(e) => {
            e.preventDefault();
            handleSelect(diff.value);
          }}
          sx={{
            cursor: "pointer",
            borderRadius: 4,
            overflow: "hidden",
            backgroundColor: (theme) => theme.palette.primary.main,
            p: 1.5,
            m: 1,
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
                checked={
                  selected.filter((s: number) => s === diff.value).length === 1
                }
              />
            }
            label={diff.label}
          />
        </Box>
      ))}
      <Stack direction="row" justifyContent={"center"} sx={{ width: "100%" }}>
        <IconButton
          onClick={() => {
            setStep(2);
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <IconButton
          disabled={selected.length === 0}
          onClick={() => {
            setStep(4);
          }}
        >
          <ArrowForwardIcon />
        </IconButton>
      </Stack>
    </>
  );
};
export default PopularitySection;

type myProps = {
  handleSelect: (id: number) => void;
  selected: number[];
  setStep: (val: number) => void;
};
