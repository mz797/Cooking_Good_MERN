import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import React, { useEffect, useState } from "react";
import { loadCategories } from "../../../store/actions/CategoryActions";
import CategoriesSection from "./CategoriesSection";
import DifficultySection from "./DifficultySection";
import TimeSection from "./TimeSection";

const LotteryDialog = ({ open, onClose }: myProps) => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.categories.categoryList);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<number[]>([]);
  const [selectedTime, setSelectedTime] = useState<number[]>([]);
  const [step, setStep] = useState<number>(0);

  useEffect(() => {
    dispatch(loadCategories());
  }, []);

  const handleCategorySelect = (id: string) => {
    if (selectedCategories.find((cId) => cId === id)) {
      setSelectedCategories((prev: string[]) =>
        prev.filter((cId) => cId !== id)
      );
    } else if (selectedCategories.length < 3) {
      setSelectedCategories((prev: string[]) => [...prev, id]);
    }
  };

  const handleDifficultySelect = (val: number) => {
    if (selectedDifficulty.find((sVal) => sVal === val)) {
      setSelectedDifficulty((prev: number[]) =>
        prev.filter((cId) => cId !== val)
      );
    } else {
      setSelectedDifficulty([val]);
    }
  };
  const handleTimeSelect = (val: number) => {
    if (selectedTime.find((sVal) => sVal === val)) {
      setSelectedTime((prev: number[]) => prev.filter((cId) => cId !== val));
    } else {
      setSelectedTime([val]);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle
        sx={{
          color: (theme) => theme.palette.primary.main,
          borderBottom: "1px solid #aaa",
          mb: 2,
        }}
      >
        Zanim poznasz danie, odpowiedz na pytanie
      </DialogTitle>
      <DialogContent sx={{ width: { md: 600 } }}>
        {step === 0 && (
          <CategoriesSection
            step={step}
            setStep={setStep}
            categories={categories}
            selectedCategories={selectedCategories}
            handleCategorySelect={handleCategorySelect}
          />
        )}
        {step === 1 && (
          <DifficultySection
            setStep={setStep}
            selectedDifficulty={selectedDifficulty}
            handleDifficultySelect={handleDifficultySelect}
          />
        )}
        {step === 2 && (
          <TimeSection
            setStep={setStep}
            selectedTime={selectedTime}
            handleTimeSelect={handleTimeSelect}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
export default LotteryDialog;
type myProps = {
  open: boolean;
  onClose: () => void;
};
