import React from "react";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import { Box, Stack, Typography } from "@mui/material";

const StarsRating = ({ rates }: myProps) => {
  const sum = rates.map((r) => r.rate).reduce((a, b) => a + b, 0);
  const avg = sum / rates.length || 0;

  const getStarIcon = (index: number) => {
    if (avg >= index + 1) {
      return <StarIcon />;
    } else if (avg >= index + 0.5) {
      return <StarHalfIcon />;
    } else {
      return <StarOutlineIcon />;
    }
  };

  return (
    <Stack alignItems="center">
      <Box display="flex">
        {Array.from({ length: 5 }, (_, index) => (
          <React.Fragment key={index}>{getStarIcon(index)}</React.Fragment>
        ))}
      </Box>
      <Typography
        sx={{ textShadow: (theme) => `0 0 5px ${theme.palette.text.dark}` }}
      >
        ({rates.length})
      </Typography>
    </Stack>
  );
};

export default StarsRating;
type myProps = {
  rates: { creator: string; rate: number }[];
};
