import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import PasswordInput from "../../Components/Auth/PasswordInput";
import { useNotification } from "../../hooks/notification-hook";
import { IntroShape } from "./Login";

const StyledTextField = styled(TextField)`
  width: 100%;
`;

type Inputs = {
  email: string;
  name: string;
  password: string;
  confPassword: string;
};

const Signup = () => {
  const { displayNotification } = useNotification();
  const [isSignedUp, setIsSignedUp] = useState<Boolean>(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>({ mode: "onTouched" });

  const handleFormSubmit = async (data: Inputs) => {
    let res: any;
    try {
      res = await axios.post("http://localhost:8080/users/signup", data);
    } catch (err: any) {
      console.log(err);
      if (err.response) {
        displayNotification({
          message: err.response.data.message,
          type: "error",
          open: true,
        });
      } else {
        displayNotification({
          message: "Wystąpił błąd logowania.",
          type: "error",
          open: true,
        });
      }
      return;
    }
    setIsSignedUp(true);
    displayNotification({
      message: "Zarejestrowano się.",
      type: "success",
      open: true,
    });
  };

  return (
    <Box
      sx={{
        position: "relative",
        height: "calc( 100vh - 64px )",
        overflow: "hidden",
        p: 4,
        pt: 8,
        background: (theme) => theme.palette.background.darker,
      }}
    >
      <IntroShape />
      <Grid container sx={{ height: "100%" }}>
        <Grid item xs={6} />
        {!isSignedUp && (
          <Grid
            item
            xs={6}
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              px: 6,
            }}
          >
            <Typography variant="h3" sx={{ textAlign: "center", mb: 2 }}>
              Zarejestruj się
            </Typography>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <StyledTextField
                sx={{ mb: 2 }}
                label="E-mail*"
                {...register("email", {
                  required: {
                    value: true,
                    message: "To pole jest wymagane",
                  },
                })}
                error={!!errors.email}
                helperText={errors?.email?.message || ""}
              />
              <StyledTextField
                sx={{ mb: 2 }}
                label="Nazwa użytkownika*"
                {...register("name", {
                  required: {
                    value: true,
                    message: "To pole jest wymagane",
                  },
                  minLength: {
                    value: 3,
                    message: "Wprowadz conajmniej 3 znaki",
                  },
                })}
                error={!!errors.name}
                helperText={errors?.name?.message || ""}
              />
              <PasswordInput
                label="Hasło*"
                name="password"
                register={register}
                validation={{
                  required: {
                    value: true,
                    message: "Pole jest wymagane",
                  },
                  minLength: {
                    value: 6,
                    message: "Hasło musi mieć conajmniej 6 znaków.",
                  },
                }}
                error={errors.password}
                sx={{ mb: 2 }}
              />
              <PasswordInput
                label="Powtórz hasło*"
                name="confPassword"
                register={register}
                validation={{
                  required: {
                    value: true,
                    message: "To pole jest wymagane",
                  },
                  validate: (cPswd: string) => {
                    if (cPswd !== watch("password"))
                      return "Hasła muszę być takie same.";
                  },
                }}
                error={errors.confPassword}
              />
              <Button
                disabled={!!Object.keys(errors).length}
                variant="contained"
                sx={{
                  mt: 2,
                  width: "100%",
                  background: (theme) => theme.color.header,
                  color: (theme) => theme.palette.text.light,
                  "&:hover": {
                    background: (theme) => theme.color.headerDarker,
                  },
                }}
                type="submit"
              >
                Zarejestruj się
              </Button>
            </form>
          </Grid>
        )}
        {isSignedUp && (
          <Grid
            item
            xs={6}
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              px: 6,
            }}
          >
            <Typography variant="h3" sx={{ textAlign: "center", mb: 2 }}>
              Aktywuj swoje konto
            </Typography>
            <Typography variant="h5" sx={{ textAlign: "center", mb: 2 }}>
              Sprawdz pocztę
            </Typography>
            <Typography
              variant="h5"
              component={"span"}
              sx={{ textAlign: "center", mb: 2 }}
            >
              Wysłaliśmy link aktywacyjny na email:{" "}
            </Typography>
            <Typography
              variant="h5"
              component={"span"}
              sx={{ textAlign: "center", mb: 2, fontWeight: 600 }}
            >
              {watch("email")}
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Signup;
