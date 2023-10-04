import { AlertColor } from "@mui/material";

export const SET_NOTIFICATION = "SET_NOTIFICATION";

export interface iNotification {
  message: string;
  type: AlertColor;
  open: boolean;
}
