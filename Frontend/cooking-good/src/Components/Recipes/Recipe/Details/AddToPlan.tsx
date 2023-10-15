import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { useAppSelector } from "../../../../store/store";
import { useForm } from "react-hook-form";
import React from "react";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const AddToPlan = ({ open, onClose }: myProps) => {
  const recipe = useAppSelector((state) => state.recipes.recipeDetail);
  const user = useAppSelector((state) => state.auth.user);

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    mode: "onTouched",
  });

  const { onChange, ...datePickerRegisterProps } = register("date", {
    required: { value: true, message: "Pole jest wymagane." },
  });
  const handleFormSubmit = (data: Inputs) => {
    console.log(dayjs(data.date).format("DD-MM-YYYY"));
  };

  return (
    <Dialog open={open} onClose={onClose} sx={{ p: 2 }}>
      <DialogTitle>Zaplanuj posiłek</DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Wybierz planowaną datę dla tego posiłku.
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"pl"}>
            <DemoContainer components={["DatePicker"]}>
              <DesktopDatePicker
                format="DD-MM-YYYY"
                label="Data"
                {...datePickerRegisterProps}
                onChange={(newValue: Dayjs | null) =>
                  setValue("date", newValue)
                }
              />
            </DemoContainer>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button type="button">Zamknij</Button>
          <Button variant="contained" type={"submit"}>
            Zapisz
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
export default AddToPlan;

type myProps = {
  open: boolean;
  onClose: () => void;
};

type Inputs = {
  date: Dayjs | null;
};
