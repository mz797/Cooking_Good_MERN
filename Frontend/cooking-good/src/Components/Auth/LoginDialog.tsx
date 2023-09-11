import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const LoginDialog = ({ open, onClose, title, content }: myProps) => {
  const navigate = useNavigate();
  const navigateToLogin = () => {
    navigate("/auth/login");
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
        <DialogActions>
          <Button onClick={onClose} variant="text">
            Anuluj
          </Button>
          <Button onClick={navigateToLogin} variant="contained">
            Zaloguj się
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};
export default LoginDialog;

type myProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  content: string;
};
