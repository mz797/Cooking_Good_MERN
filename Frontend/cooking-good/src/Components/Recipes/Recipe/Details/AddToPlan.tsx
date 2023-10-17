import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import { useForm } from "react-hook-form";
import React from "react";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import {
  addErrorNotification,
  addSuccessNotification,
} from "../../../../store/reducers/notificationReducer";

const AddToPlan = ({ open, onClose }: myProps) => {
  const recipe = useAppSelector((state) => state.recipes.recipeDetail);
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const {
    register,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    mode: "onTouched",
  });

  const { onChange, ...datePickerRegisterProps } = register("date", {
    required: { value: true, message: "Pole jest wymagane." },
  });
  const handleFormSubmit = async (data: Inputs) => {
    if (!auth || !auth.token || !auth.user || !recipe) return;
    try {
      const res = await axios.post(
        `http://localhost:8080/users/planner/${auth?.user.userId}/${recipe.id}`,
        { date: dayjs(data.date).format("DD-MM-YYYY") },
        { headers: { Authorization: "Bearer " + auth.token } }
      );
      console.log(res);
      if (res.status === 200) {
        dispatch(
          addSuccessNotification({ message: "Dodano nową pozycję do planera." })
        );
        reset();
        onClose();
      }
    } catch (err) {
      dispatch(
        addErrorNotification({
          message: "Nie udało się dodać przepisu do planera.",
        })
      );
    }
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
          <Button type="button" onClick={onClose}>
            Zamknij
          </Button>
          <Button
            variant="contained"
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
export default AddToPlan;

type myProps = {
  open: boolean;
  onClose: () => void;
};

type Inputs = {
  date: Dayjs | null;
};
