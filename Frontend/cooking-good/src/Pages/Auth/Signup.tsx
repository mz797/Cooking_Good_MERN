import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import PasswordInput from "../../Components/Auth/PasswordInput";
import { useNotification } from "../../hooks/notification-hook";

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
        minHeight: "100vh",
        p: 4,
        pt: 8,
        display: "flex",
        justifyContent: "center",
        alignItems: "start",
        background: (theme) => theme.palette.background.darker,
      }}
    >
      <Card sx={{ maxWidth: 900, width: "80vw", minHeight: "50vh" }}>
        <Grid container sx={{ minHeight: "50vh" }}>
          {!isSignedUp && (
            <Grid item xs={7}>
              <CardContent sx={{ flex: "1 0 auto" }}>
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
                      color: (theme) => theme.palette.text.light,
                    }}
                    type="submit"
                  >
                    Zarejestruj się
                  </Button>
                </form>
              </CardContent>
            </Grid>
          )}
          {isSignedUp && (
            <Grid item xs={7}>
              <CardContent
                sx={{ height: "100%" }}
                component={Stack}
                justifyContent={"space-evenly"}
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
              </CardContent>
            </Grid>
          )}
          <Grid
            item
            xs={5}
            sx={{
              backgroundImage: `url(http://localhost:8080/uploads/images/auth-background.png)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </Grid>
      </Card>
    </Box>
  );
};

export default Signup;
