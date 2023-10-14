import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { notAuthRouter, router } from "./Router/ApplicationRouter";
import { RootState, useAppDispatch, useAppSelector } from "./store/store";
import { useAuth } from "./hooks/auth-hook";
import { setMode } from "./store/reducers/themeReducer";

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
    header: "#352d2a",
    headerDarker: "#4d423d",
  },
  palette: {
    primary: {
      main: "#218250",
    },
    text: {
      dark: "#000",
      light: "#fff",
    },
    background: {
      light: "#fff",
      darker: "#191A19",
      gray: "#535353",
      darkGray: "#383838",
    },
    mode: "dark",
    contrastThreshold: 3,
  },
});

function App() {
  const { token } = useAuth();
  const dispatch = useAppDispatch();
  const userToken = useAppSelector((state: RootState) => state.auth.token);
  const darkMode = useAppSelector((state) => state.theme.darkMode);

  useEffect(() => {
    const darkMode = localStorage.getItem("darkMode");
    dispatch(setMode(darkMode === "true"));
  }, []);

  return (
    <div>
      <ThemeProvider theme={!darkMode ? themeLight : themeDark}>
        <CssBaseline />
        <RouterProvider
          router={!!token || !!userToken ? router : notAuthRouter}
        />
      </ThemeProvider>
    </div>
  );
}

export default App;
