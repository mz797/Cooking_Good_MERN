import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useForm } from "react-hook-form";
import ImageUpload from "../common/ImageUpload";

const UpdateUserImage = ({ open, onSave, onClose }: myProps) => {
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
      <DialogTitle>Edytuj zdjęcie profilowe</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ display: "flex", justifyContent: "center" }}>
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
          <Button variant={"contained"} type={"submit"}>
            Zapisz
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
export default UpdateUserImage;
type myProps = {
  open: boolean;
  onSave: (formData: FormData) => void;
  onClose: () => void;
};
type Inputs = {
  image: File | undefined;
};
