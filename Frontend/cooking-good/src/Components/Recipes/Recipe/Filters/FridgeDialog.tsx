import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";

const FridgeDialog = ({ open, onClose, onSave, defaultValue }: myProps) => {
  const [value, setValue] = useState<string>("");
  return (
    <div>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Wypisz po przecinku produkty, które już masz.</DialogTitle>
        <DialogContent>
          <TextField
            defaultValue={defaultValue}
            label="Produkty"
            multiline={true}
            maxRows={3}
            minRows={3}
            sx={{ width: "100%", my: 1 }}
            onChange={(e) => setValue(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Anuluj</Button>
          <Button onClick={() => onSave("")}>Wyczyść</Button>
          <Button onClick={() => onSave(value)}>Zapisz</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default FridgeDialog;

type myProps = {
  open: boolean;
  defaultValue: string;
  onClose: () => void;
  onSave: (value: string) => void;
};
