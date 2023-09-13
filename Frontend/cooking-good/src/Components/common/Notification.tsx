import { Alert, Snackbar, SnackbarCloseReason } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { useNotification } from "../../hooks/notification-hook";
import { RootState } from "../../store/store";

const Notification = () => {
  const notification = useSelector((state: RootState) => state.notification);

  const { clearMyNotification } = useNotification();

  const handleClose = (_: unknown, reason?: SnackbarCloseReason) => {
    reason !== "clickaway" && clearMyNotification();
  };

  return (
    <Snackbar
      open={notification.open}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        variant="filled"
        onClose={handleClose}
        severity={notification.type}
      >
        {notification.message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
