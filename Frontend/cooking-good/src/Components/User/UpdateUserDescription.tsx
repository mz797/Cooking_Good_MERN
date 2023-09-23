import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";

const UpdateUserDescription = ({
  open,
  onSave,
  description,
  onClose,
}: myProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    mode: "onTouched",
    defaultValues: { description: description || "" },
  });

  const onSubmit = async (data: Inputs) => {
    onSave(data);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Edytuj opis użytkownika</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ display: "flex", justifyContent: "center" }}>
          <TextField
            multiline
            rows={3}
            sx={{ width: "100%" }}
            label="Opis*"
            id={"description"}
            {...register("description")}
          />
        </DialogContent>
        <DialogActions>
          <Button variant={"outlined"} type={"button"} onClick={onClose}>
            Anuluj
          </Button>
          <Button
            variant={"contained"}
            type={"submit"}
            sx={{ color: (theme) => theme.palette.text.light }}
          >
            Zapisz
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
export default UpdateUserDescription;
type myProps = {
  open: boolean;
  onSave: (data: Inputs) => void;
  onClose: () => void;
  description: string;
};
type Inputs = {
  description: string | undefined;
};
