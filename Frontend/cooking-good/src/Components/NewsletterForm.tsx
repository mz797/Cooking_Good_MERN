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
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 200 200'%3E%3Cdefs%3E%3ClinearGradient id='a' gradientUnits='userSpaceOnUse' x1='100' y1='33' x2='100' y2='-3'%3E%3Cstop offset='0' stop-color='%23000' stop-opacity='0'/%3E%3Cstop offset='1' stop-color='%23000' stop-opacity='1'/%3E%3C/linearGradient%3E%3ClinearGradient id='b' gradientUnits='userSpaceOnUse' x1='100' y1='135' x2='100' y2='97'%3E%3Cstop offset='0' stop-color='%23000' stop-opacity='0'/%3E%3Cstop offset='1' stop-color='%23000' stop-opacity='1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cg fill='%23009958' fill-opacity='0.1'%3E%3Crect x='100' width='100' height='100'/%3E%3Crect y='100' width='100' height='100'/%3E%3C/g%3E%3Cg fill-opacity='0.05'%3E%3Cpolygon fill='url(%23a)' points='100 30 0 0 200 0'/%3E%3Cpolygon fill='url(%23b)' points='100 100 0 130 0 100 200 100 200 130'/%3E%3C/g%3E%3C/svg%3E")`,
        backgroundColor: "#30b470",
      }}
    >
      <Container sx={{ mb: 4, p: 0, py: 8 }} maxWidth={"xl"}>
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            color: (theme: Theme) => theme.palette.text.light,
            textShadow: "0 0 10px #111",
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
              textShadow: "0 0 10px #111",
            }}
          >
            Chcesz być na bieżąco? Zapisz się na nasz NEWSLETTER!
          </Typography>
          <form
            onSubmit={handleSubmit(handleSignToNewsletter)}
            style={{ width: "100%" }}
          >
            <Stack
              direction="row"
              alignItems="start"
              justifyContent="center"
              spacing={2}
            >
              <TextField
                sx={{
                  width: "25%",
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
                  width: "25%",
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
