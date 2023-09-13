import {
  Box,
  Button,
  Container,
  Stack,
  Theme,
  Typography,
} from "@mui/material";
import React from "react";
import axios from "axios";
import { useNotification } from "../hooks/notification-hook";

const NewsletterForm = ({ email }: myProps) => {
  const { displayNotification } = useNotification();
  const handleSignToNewsletter = () => {
    if (email) {
      axios
        .post("http://localhost:8080/newsletter", { email: email })
        .then((res) => {
          if (res.status === 201) {
            displayNotification({
              message: res.data.message,
              type: "success",
              open: true,
            });
          } else {
            displayNotification({
              message: res.data
                ? res.data.message
                : `Nie udało się zapisać e-maila '${email}' na newsletter.`,
              type: "error",
              open: true,
            });
          }
        })
        .catch((err) => {
          console.log(err);
          displayNotification({
            message: err.response.data
              ? err.response.data.message
              : `Nie udało się zapisać e-maila '${email}' na newsletter.`,
            type: "error",
            open: true,
          });
        });
    }
  };
  return (
    <Box
      sx={{
        width: "100%",
        background: (theme) => theme.palette.primary.main,
      }}
    >
      <Container sx={{ mb: 4, p: 0, py: 1, pb: 5 }} maxWidth={"xl"}>
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            color: (theme: Theme) => theme.palette.text.light,
            my: 4,
          }}
        >
          Newsletter
        </Typography>
        <Stack alignItems="center" sx={{ my: 4 }} spacing={2}>
          <Typography
            variant="h5"
            sx={{
              textAlign: "center",
              color: (theme: Theme) => theme.palette.text.light,
            }}
          >
            Chcesz być na bieżąco? Zapisz się na nasz newsletter!
          </Typography>
          <Button
            variant="contained"
            sx={{
              width: "50%",
              fontSize: 16,
              background: (theme: Theme) => theme.palette.background.light,
              color: (theme: Theme) => theme.palette.primary.main,
              "&:hover": {
                background: (theme: Theme) => theme.palette.background.light,
                color: (theme: Theme) => theme.palette.primary.main,
              },
            }}
            onClick={handleSignToNewsletter}
          >
            Zapisz się
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default NewsletterForm;

type myProps = {
  email: string | undefined;
};
