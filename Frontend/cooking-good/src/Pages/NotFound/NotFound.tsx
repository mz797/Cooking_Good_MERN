import { Container, Typography } from "@mui/material";
import React, { useEffect } from "react";
import Navigation from "../../Components/Navigation";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/");
  }, []);
  return (
    <>
      <Navigation />
      <Container sx={{ mb: 8 }}>
        <Typography variant="h5">Nie ma takiej strony</Typography>
      </Container>
    </>
  );
};

export default NotFound;
