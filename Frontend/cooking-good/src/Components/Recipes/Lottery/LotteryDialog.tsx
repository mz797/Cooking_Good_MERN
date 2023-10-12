import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import React, { useEffect, useMemo, useState } from "react";
import { loadCategories } from "../../../store/actions/CategoryActions";
import CategoriesSection from "./CategoriesSection";
import DifficultySection from "./DifficultySection";
import TimeSection from "./TimeSection";
import PopularitySection from "./PopularitySection";
import WinnerSection from "./WinnerSection";

function median(arr: number[]): number {
  const mid = Math.floor(arr.length / 2);
  const sortedArr = arr.sort((a: number, b: number) => a - b);

  if (arr.length % 2 === 0) {
    return (sortedArr[mid - 1] + sortedArr[mid]) / 2;
  } else {
    return sortedArr[mid];
  }
}

const LotteryDialog = ({ open, onClose }: myProps) => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.categories.categoryList);
  const recipes = useAppSelector((state) => state.recipes.recipesList);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<number[]>([]);
  const [selectedTime, setSelectedTime] = useState<number[]>([]);
  const [selectedPopularity, setSelectedPopularity] = useState<number[]>([]);
  const [step, setStep] = useState<number>(0);

  useEffect(() => {
    dispatch(loadCategories());
  }, []);

  const lotteryWinner = useMemo(() => {
    let filteredRecipes = [...recipes];

    filteredRecipes = filteredRecipes.filter(
      (recipe) =>
        selectedCategories.filter((category) =>
          recipe.categories.map((c) => c.id).includes(category)
        ).length > 0
    );

    if (selectedDifficulty.length === 1) {
      filteredRecipes = filteredRecipes.filter(
        (recipe) => recipe.difficulty === selectedDifficulty[0]
      );
    }
    if (selectedTime.length === 1) {
      filteredRecipes = filteredRecipes.filter(
        (recipe) => recipe.time <= selectedTime[0]
      );
    }
    if (selectedPopularity.length === 1 && filteredRecipes.length > 1) {
      const mediumValue = median(
        filteredRecipes.map((recipe) => recipe.visitCount)
      );
      if (selectedPopularity[0] === 1)
        filteredRecipes = filteredRecipes.filter(
          (recipe) => recipe.visitCount >= mediumValue
        );
      else
        filteredRecipes = filteredRecipes.filter(
          (recipe) => recipe.visitCount <= mediumValue
        );
    }

    return filteredRecipes[Math.floor(Math.random() * filteredRecipes.length)];
  }, [
    recipes,
    selectedCategories,
    selectedDifficulty,
    selectedTime,
    selectedPopularity,
  ]);

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

  const handlePopularitySelect = (val: number) => {
    if (selectedPopularity.find((sVal) => sVal === val)) {
      setSelectedPopularity((prev: number[]) =>
        prev.filter((cId) => cId !== val)
      );
    } else {
      setSelectedPopularity([val]);
    }
  };

  const reset = () => {
    setSelectedCategories([]);
    setSelectedDifficulty([]);
    setSelectedTime([]);
    setSelectedPopularity([]);
  };
  const handleClose = () => {
    setStep(0);
    reset();
    onClose();
  };
  const refreshLottery = () => {
    reset();
    setStep(0);
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle
        sx={{
          color: (theme) => theme.palette.primary.main,
          borderBottom: "1px solid #aaa",
          mb: 2,
        }}
      >
        {step !== 4
          ? "Zanim poznasz danie, odpowiedz na pytanie"
          : "Nasza propozycja na dziś"}
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
        {step === 3 && (
          <PopularitySection
            setStep={setStep}
            handleSelect={handlePopularitySelect}
            selected={selectedPopularity}
          />
        )}
        {step === 4 && <WinnerSection recipe={lotteryWinner} />}
      </DialogContent>
      {step === 4 && (
        <DialogActions>
          <Button onClick={handleClose}>Zamknij</Button>
          <Button onClick={refreshLottery}>Jeszcze raz</Button>
        </DialogActions>
      )}
    </Dialog>
  );
};
export default LotteryDialog;
type myProps = {
  open: boolean;
  onClose: () => void;
};
