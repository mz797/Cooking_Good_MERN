import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import React from "react";
import { RouterProvider } from "react-router-dom";
import { notAuthRouter, router } from "./Router/ApplicationRouter";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import { useAuth } from "./hooks/auth-hook";

const themeLight = createTheme({
  color: {
    header: "#584b45",
    headerDarker: "#4d423d",
  },
  palette: {
    primary: {
      main: "#30b470",
    },
    text: {
      dark: "#000",
      light: "#fff",
    },
    background: {
      light: "#fff",
      darker: "#f1f1ee",
      gray: "#bdbebc",
      darkGray: "#959595",
    },
    success: { main: "#30b470" },
    contrastThreshold: 3,
  },
});
const themeDark = createTheme({
  color: {
    header: "#584b45",
    headerDarker: "#4d423d",
  },
  palette: {
    primary: {
      main: "#30b470",
    },
    text: {
      dark: "#000",
      light: "#fff",
    },
    background: {
      light: "#fff",
      darker: "#f1f1ee",
      gray: "#bdbebc",
      darkGray: "#959595",
    },
    mode: "dark",
    contrastThreshold: 3,
  },
});

function App() {
  const { token } = useAuth();
  const userToken = useSelector((state: RootState) => state.auth.token);
  console.log(token);

  return (
    <div>
      <ThemeProvider theme={themeLight}>
        <CssBaseline />
        <RouterProvider
          router={!!token || !!userToken ? router : notAuthRouter}
        />
      </ThemeProvider>
    </div>
  );
}

export default App;
