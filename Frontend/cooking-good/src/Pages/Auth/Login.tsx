import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../store/authSlice";
import { useNotification } from "../../hooks/notification-hook";
import PasswordInput from "../../Components/Auth/PasswordInput";
import FacebookAuth from "./FacebookAuth";

const StyledTextField = styled(TextField)`
  width: 100%;
`;

export const IntroShape = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  clip-path: polygon(0 0, 54% 0, 34% 100%, 0% 100%);
  background-image: url("http://localhost:8080/uploads/images/background.jpg");
`;

type Inputs = {
  email: string;
  password: string;
};
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { displayNotification } = useNotification();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({ mode: "onTouched" });

  const handleFormSubmit = async (data: Inputs) => {
    let res: any;
    try {
      res = await axios.post("http://localhost:8080/users/login", data);
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
          message: "Wystąpił błąd logowania",
          type: "error",
          open: true,
        });
      }
      return;
    }
    console.log("zalogowany", res);
    if (res.status === 200) {
      dispatch(login({ user: res.data.user, token: res.data.token }));
      console.log({ user: res.data.user, token: res.data.token });
      navigate("/");
    }
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
            Zaloguj się
          </Typography>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <StyledTextField
              label="E-mail*"
              sx={{ mb: 2 }}
              {...register("email", {
                required: {
                  value: true,
                  message: "Pole jest wymagane",
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message?.toString() || ""}
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
              }}
              error={errors.password}
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
              Zaloguj się
            </Button>
          </form>
          <FacebookAuth />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login;
