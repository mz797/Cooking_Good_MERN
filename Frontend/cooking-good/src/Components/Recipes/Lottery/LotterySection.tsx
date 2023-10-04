import { Box, Button, Container, Stack, Typography } from "@mui/material";
import React from "react";
import LotteryDialog from "./LotteryDialog";

const LotterySection = () => {
  return (
    <Box
      sx={{
        width: "100%",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 200 200'%3E%3Cdefs%3E%3ClinearGradient id='a' gradientUnits='userSpaceOnUse' x1='100' y1='33' x2='100' y2='-3'%3E%3Cstop offset='0' stop-color='%23000' stop-opacity='0'/%3E%3Cstop offset='1' stop-color='%23000' stop-opacity='1'/%3E%3C/linearGradient%3E%3ClinearGradient id='b' gradientUnits='userSpaceOnUse' x1='100' y1='135' x2='100' y2='97'%3E%3Cstop offset='0' stop-color='%23000' stop-opacity='0'/%3E%3Cstop offset='1' stop-color='%23000' stop-opacity='1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cg fill='%23009958' fill-opacity='0.1'%3E%3Crect x='100' width='100' height='100'/%3E%3Crect y='100' width='100' height='100'/%3E%3C/g%3E%3Cg fill-opacity='0.05'%3E%3Cpolygon fill='url(%23a)' points='100 30 0 0 200 0'/%3E%3Cpolygon fill='url(%23b)' points='100 100 0 130 0 100 200 100 200 130'/%3E%3C/g%3E%3C/svg%3E")`,
        backgroundColor: "#30b470",
      }}
    >
      <LotteryDialog />
      <Container
        sx={{
          mb: 4,
          p: 0,
          py: 8,
        }}
        maxWidth={"xl"}
      >
        <Stack alignItems="center">
          <Typography
            variant="h4"
            sx={{
              mb: 2,
              color: (theme) => theme.palette.text.light,
              textAlign: "center",
              textShadow: `0 0 10px #111`,
            }}
          >
            Brak pomysłu?
          </Typography>
          <Button
            variant="contained"
            sx={{
              background: (theme) => theme.palette.text.light,
              color: (theme) => theme.palette.primary.main,
              fontSize: 20,
              "&:hover": {
                background: "#eee",
              },
            }}
          >
            Wypróbuj naszą maszynę losującą!
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};
export default LotterySection;
