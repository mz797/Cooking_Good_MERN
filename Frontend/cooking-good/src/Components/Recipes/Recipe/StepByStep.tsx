import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  ListItem,
  Paper,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { RecipeType } from "../../../types/recipe-types";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import React, { useState } from "react";
import DescriptionIcon from "@mui/icons-material/Description";

const StepByStep = ({ recipe, open, onClose }: myProps) => {
  const [step, setStep] = useState<number>(0);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Dialog open={open} maxWidth="md" onClose={onClose}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ px: 2 }}
      >
        <DialogTitle sx={{ width: 800 }}>{recipe.name}</DialogTitle>
        <IconButton onClick={handleClick}>
          <DescriptionIcon />
        </IconButton>
        {/*<Popper*/}
        {/*  open={Boolean(anchorEl)}*/}
        {/*  anchorEl={anchorEl}*/}
        {/*  sx={{ zIndex: 99999 }}*/}
        {/*>*/}
        {/*  <Box sx={{ border: 1, p: 1, bgcolor: "background.paper" }}>*/}
        {/*    The content of the Popper.*/}
        {/*  </Box>*/}
        {/*</Popper>*/}
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          sx={{ zIndex: 99999, width: "auto" }}
        >
          <Paper
            sx={{
              minWidth: 300,
              p: 2,
              background: (theme) => theme.palette.background.darker,
            }}
          >
            <Typography
              variant="h5"
              sx={{
                mb: 1,
                p: 1,
                textAlign: "center",
                color: (theme) => theme.palette.primary.main,
                borderBottom: (theme) => `1px solid ${theme.palette.text.dark}`,
              }}
            >
              Składniki
            </Typography>
            {recipe.ingredients.map((i, index) => (
              <>
                <ListItem key={index} sx={{ p: 0 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                      px: 1,
                      py: 0.25,
                      width: "100%",
                    }}
                    key={index}
                  >
                    <Typography
                      sx={{
                        fontSize: { xs: 16, sm: 20 },
                        textTransform: "uppercase",
                        letterSpacing: { sm: 1 },
                        maxWidth: "70%",
                      }}
                    >
                      {i.name}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: 16, sm: 20 },
                        maxWidth: "30%",
                        textAlign: "end",
                      }}
                    >
                      {i.amount}
                    </Typography>
                  </Stack>
                </ListItem>
                <Divider />
              </>
            ))}
          </Paper>
        </Popover>
      </Stack>
      <DialogContent>
        <div
          dangerouslySetInnerHTML={{
            __html: recipe.description[step].content,
          }}
        />
      </DialogContent>
      <DialogActions>
        <Stack direction="row" justifyContent={"center"} sx={{ width: "100%" }}>
          <IconButton
            disabled={step === 0}
            onClick={() => {
              if (step > 0) setStep((prev) => prev - 1);
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <IconButton
            disabled={step === recipe.description.length - 1}
            onClick={() => {
              if (step < recipe.description.length - 1)
                setStep((prev) => prev + 1);
            }}
          >
            <ArrowForwardIcon />
          </IconButton>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};
export default StepByStep;
type myProps = {
  open: boolean;
  recipe: RecipeType;
  onClose: () => void;
};
