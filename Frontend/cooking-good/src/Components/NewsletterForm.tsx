import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Theme,
  Typography,
} from "@mui/material";
import React from "react";
import axios from "axios";
import { useNotification } from "../hooks/notification-hook";
import { useForm } from "react-hook-form";

type Inputs = {
  email: string;
};

const NewsletterForm = ({ email }: myProps) => {
  const { displayNotification } = useNotification();

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({ defaultValues: { email: email || "" } });
  const handleSignToNewsletter = (data: Inputs) => {
    if (data.email) {
      axios
        .post("http://localhost:8080/newsletter", { email: data.email })
        .then((res) => {
          if (res.status === 201) {
            displayNotification({
              message: res.data.message,
              type: "success",
              open: true,
            });
            reset();
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
            Chcesz być na bieżąco? Zapisz się na nasz NEWSLETTER!
          </Typography>
          <form onSubmit={handleSubmit(handleSignToNewsletter)}>
            <Stack direction="row" alignItems="start" spacing={2}>
              <TextField
                sx={{
                  ".MuiInputLabel-root": { color: "#fff" },
                  ".MuiInputLabel-root.Mui-focused": { color: "#fff" },
                  ".MuiOutlinedInput-root": {
                    color: "#fff",
                    "& fieldset": {
                      borderColor: "white",
                    },
                    "&:hover fieldset": {
                      borderColor: "white",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "white",
                    },
                  },
                }}
                label="E-mail*"
                {...register("email", {
                  required: "To pole jest obowiązkowe",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Wprowadz poprawny e-mail",
                  },
                })}
                error={!!errors.email}
                helperText={!!errors.email && errors.email.message}
              />

              <Button
                type="submit"
                variant="contained"
                sx={{
                  width: "50%",
                  height: 56,
                  fontSize: 16,
                  background: (theme: Theme) => theme.palette.background.light,
                  color: (theme: Theme) => theme.palette.primary.main,
                  "&:hover": {
                    background: (theme: Theme) =>
                      theme.palette.background.light,
                    color: (theme: Theme) => theme.palette.primary.main,
                  },
                }}
              >
                Zapisz się
              </Button>
            </Stack>
          </form>
        </Stack>
      </Container>
    </Box>
  );
};

export default NewsletterForm;

type myProps = {
  email: string | undefined;
};
