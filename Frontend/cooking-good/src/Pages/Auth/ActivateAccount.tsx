import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useNotification } from "../../hooks/notification-hook";
import { Box, Button, Grid, Typography } from "@mui/material";
import { IntroShape } from "./Login";

const ActivateAccount = () => {
  const [isActivated, setIsActivated] = useState<Boolean>(false);
  const params = useParams();
  const navigate = useNavigate();
  const { displayNotification } = useNotification();
  useEffect(() => {
    const activateUser = async () => {
      let res;
      try {
        res = await axios.get(
          `http://localhost:8080/users/activate/${params.token}`
        );
        if (res.status === 200) {
          setIsActivated(true);
        }
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
            message: "Wystąpił błąd podczas próby aktywacji.",
            type: "error",
            open: true,
          });
        }
        return;
      }
    };

    activateUser();
  }, []);

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
        {isActivated && (
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
              Gratulacje od teraz Twoje konto jest aktywne!
            </Typography>
            <Button
              variant="contained"
              sx={{
                color: (theme) => theme.palette.text.light,
                background: (theme) => theme.color.header,
                "&:hover": {
                  background: (theme) => theme.color.headerDarker,
                },
              }}
              onClick={() => {
                navigate("/auth/login");
              }}
            >
              Zaloguj się
            </Button>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};
export default ActivateAccount;
