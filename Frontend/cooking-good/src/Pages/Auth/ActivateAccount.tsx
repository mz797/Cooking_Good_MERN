import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useNotification } from "../../hooks/notification-hook";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";

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
    <Card sx={{ display: "flex" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box sx={{ p: 2, maxWidth: 600 }}>
          {isActivated && (
            <CardContent sx={{ flex: "1 0 auto" }}>
              <Typography variant="h3" sx={{ textAlign: "center", mb: 2 }}>
                Gratulacje od teraz Twoje konto jest aktywne!
              </Typography>
              <Button
                variant="contained"
                sx={{ color: (theme) => theme.palette.text.light }}
                onClick={() => {
                  navigate("/auth/login");
                }}
              >
                Zaloguj się
              </Button>
            </CardContent>
          )}
        </Box>
      </Box>
      <CardMedia
        component="img"
        sx={{ width: 151 }}
        image="/static/images/cards/live-from-space.jpg"
        alt="Live from space album cover"
      />
    </Card>
  );
};
export default ActivateAccount;
