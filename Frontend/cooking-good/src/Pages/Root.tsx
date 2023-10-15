import React from "react";
import Navigation from "../Components/Navigation";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../Components/Recipes/Header";

const Root = () => {
  const location = useLocation();

  return (
    <>
      <Navigation />
      {(location.pathname === "/" || location.pathname === "/recipes") && (
        <Header />
      )}
      {/* <Container
				sx={{ mb: 8, mt: 4, p: 0 }}
				maxWidth={
					location.pathname === "/" ||
					location.pathname === "/recipes"
						? "xl"
						: "lg"
				}> */}
      <Outlet />
      {/* </Container> */}
    </>
  );
};

export default Root;
