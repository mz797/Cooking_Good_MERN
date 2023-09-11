import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import PasswordInput from "../../Components/Auth/PasswordInput";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../store/authSlice";
import { useNotification } from "../../hooks/notification-hook";

const StyledTextField = styled(TextField)`
  width: 100%;
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
        mt: 4,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card>
        <Grid container>
          <Grid item xs={7}>
            <CardContent sx={{ flex: "1 0 auto" }}>
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
                  sx={{ mt: 2, width: "100%" }}
                  type="submit"
                >
                  Zaloguj się
                </Button>
              </form>
            </CardContent>
          </Grid>
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

export default Login;
