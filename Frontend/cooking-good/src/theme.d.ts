import { PaletteColorOptions } from "@mui/material";

declare module "@mui/material/styles" {
  interface Palette {
    text: {
      dark: PaletteColor;
      light: PaletteColor;
    };
  }

  interface PaletteOptions {
    text: {
      dark: PaletteColorOptions;
      light: PaletteColorOptions;
    };
  }

  interface TypeBackground {
    default: string;
    paper: string;
    light: string;
    darker: string;
    gray: string;
    darkGray: string;
  }

  interface TypeText {
    primary: string;
    secondary: string;
    disabled: string;
    dark: string;
    light: string;
  }

  interface Theme {
    color: {
      header: string;
      headerDarker: string;
    };
  }

  interface ThemeOptions {
    color: {
      header: React.CSSProperties["color"];
      headerDarker: React.CSSProperties["color"];
    };
  }
}
