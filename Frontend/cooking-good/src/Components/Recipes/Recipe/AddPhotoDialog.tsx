import { useForm } from "react-hook-form";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import ImageUpload from "../../common/ImageUpload";

const AddPhotoDialog = ({ open, onSave, onClose }: myProps) => {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    mode: "onTouched",
    defaultValues: { image: undefined },
  });

  const selectedImageHandler = (file: File | undefined) => {
    setValue("image", file);
  };

  const onSubmit = async (data: Inputs) => {
    const formData = new FormData();

    if (data.image !== undefined) {
      formData.append("image", data.image);
      onSave(formData);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Dodaj zdjęcie</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent
          sx={{ display: "flex", justifyContent: "center", minWidth: 300 }}
        >
          <ImageUpload
            id={"image"}
            register={{
              ...register("image", {
                required: {
                  value: true,
                  message: "Pole jest wymagane",
                },
              }),
            }}
            onInput={selectedImageHandler}
            error={!!errors.image}
            helperText={errors.image?.message || ""}
            sx={{
              height: 250,
            }}
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
export default AddPhotoDialog;
type myProps = {
  open: boolean;
  onSave: (formData: FormData) => void;
  onClose: () => void;
};

type Inputs = {
  image: File | undefined;
};
