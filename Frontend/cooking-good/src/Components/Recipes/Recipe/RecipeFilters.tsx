import {
  Badge,
  Button,
  Checkbox,
  InputAdornment,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  Radio,
  Stack,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { difficultyMarks, timeMarks } from "../AddRecipe/AddRecipeBasic";
import KitchenIcon from "@mui/icons-material/Kitchen";
import NoMealsIcon from "@mui/icons-material/NoMeals";
import TuneIcon from "@mui/icons-material/Tune";
import React, { useEffect, useState } from "react";
import { ICategory } from "../../../types/category-types";
import { RecipeType } from "../../../types/recipe-types";
import dayjs from "dayjs";

const RecipeFilters = ({ categoriesList, recipeList, onFilter }: myProps) => {
  const [checkedCategories, setCheckedCategories] = useState<string[]>([]);
  const [anchorCategories, setAnchorCategories] =
    React.useState<null | HTMLElement>(null);
  const [categoriesOpen, setCategoriesOpen] = useState<boolean>(false);

  const [checkedTime, setCheckedTime] = useState<number[]>([]);
  const [anchorTime, setAnchorTime] = React.useState<null | HTMLElement>(null);
  const [timeOpen, setTimeOpen] = useState<boolean>(false);

  const [checkedDifficulty, setCheckedDifficulty] = useState<number[]>([]);
  const [anchorDifficulty, setAnchorDifficulty] =
    React.useState<null | HTMLElement>(null);
  const [difficultyOpen, setDifficultyOpen] = useState<boolean>(false);

  const [checkedSort, setCheckedSort] = useState<string>(SORT_CONSTANTS.LATEST);
  const [anchorSort, setAnchorSort] = React.useState<null | HTMLElement>(null);
  const [sortOpen, setSortOpen] = useState<boolean>(false);

  const [searchValue, setSearchValue] = useState<string>("");

  const toggleChecked = (id: string) => {
    if (checkedCategories.includes(id)) {
      setCheckedCategories((prev) => prev.filter((cId) => cId !== id));
    } else setCheckedCategories((prev) => [...prev, id]);
  };
  const toggleTimeChecked = (value: number) => {
    if (checkedTime.includes(value)) {
      setCheckedTime((prev) => prev.filter((tId) => tId !== value));
    } else setCheckedTime((prev) => [...prev, value]);
  };
  const toggleDifficultyChecked = (value: number) => {
    if (checkedDifficulty.includes(value)) {
      setCheckedDifficulty((prev) => prev.filter((tId) => tId !== value));
    } else setCheckedDifficulty((prev) => [...prev, value]);
  };
  const toggleSortChecked = (value: string) => {
    setCheckedSort(value);
  };

  const handleOpenCategories = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorCategories(e.currentTarget);
    setCategoriesOpen(true);
  };
  const handleOpenDifficulty = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorDifficulty(e.currentTarget);
    setDifficultyOpen(true);
  };
  const handleOpenTime = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorTime(e.currentTarget);
    setTimeOpen(true);
  };
  const handleOpenSort = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorSort(e.currentTarget);
    setSortOpen(true);
  };

  useEffect(() => {
    let preparedList = recipeList.filter((recipe) =>
      recipe.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    if (checkedDifficulty.length > 0) {
      preparedList = preparedList.filter((recipe) =>
        checkedDifficulty.some((d) => d === recipe.difficulty)
      );
    }
    if (checkedTime.length > 0) {
      preparedList = preparedList.filter((recipe) =>
        checkedTime.some((t) => t === recipe.time)
      );
    }
    if (checkedCategories.length > 0) {
      preparedList = preparedList.filter((recipe) =>
        recipe.categories.some((category) =>
          checkedCategories.includes(category.id)
        )
      );
    }
    preparedList = sortBy(preparedList);
    onFilter(preparedList);
  }, [
    searchValue,
    recipeList,
    checkedDifficulty,
    checkedCategories,
    checkedTime,
    checkedSort,
  ]);

  const sortBy = (recipeList: RecipeType[]): RecipeType[] => {
    if (recipeList.length > 0)
      console.log(
        dayjs(recipeList[0].addedAt).diff(dayjs(recipeList[1].addedAt))
      );
    switch (checkedSort) {
      case SORT_CONSTANTS.LATEST: {
        return recipeList.sort((a, b) =>
          dayjs(a.addedAt).diff(dayjs(b.addedAt))
        );
      }
      case SORT_CONSTANTS.OLDEST: {
        return recipeList.sort((a, b) =>
          dayjs(b.addedAt).diff(dayjs(a.addedAt))
        );
      }
      case SORT_CONSTANTS.FAVORITE: {
        return recipeList.sort((a, b) => b.likes.length - a.likes.length);
      }
      case SORT_CONSTANTS.POPULAR: {
        return recipeList.sort((a, b) => b.visitCount - a.visitCount);
      }
      case SORT_CONSTANTS.ASCENDING: {
        return recipeList.sort((a, b) => a.name.localeCompare(b.name));
      }
      case SORT_CONSTANTS.DESCENDING: {
        return recipeList.sort((a, b) => b.name.localeCompare(a.name));
      }
      default:
        return recipeList;
    }
  };

  return (
    <Stack direction="row" spacing={1} sx={{ my: 2 }}>
      <TextField
        sx={{ my: 1, width: "50%" }}
        placeholder="Szukaj"
        onChange={(e) => setSearchValue(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <Badge badgeContent={checkedCategories.length} color="primary">
        <Button
          variant="outlined"
          endIcon={<KeyboardArrowDownIcon />}
          onClick={handleOpenCategories}
        >
          Kategorie
        </Button>
      </Badge>
      <Menu
        sx={{ height: 400 }}
        open={categoriesOpen}
        onClose={() => setCategoriesOpen(false)}
        anchorEl={anchorCategories}
      >
        {categoriesList &&
          categoriesList.map((c) => (
            <ListItem key={c.id}>
              <ListItemButton onClick={() => toggleChecked(c.id)}>
                <ListItemIcon>
                  <Checkbox checked={checkedCategories.includes(c.id)} />
                </ListItemIcon>
                <ListItemText id={c.id} primary={c.name} />
              </ListItemButton>
            </ListItem>
          ))}
      </Menu>
      <Badge badgeContent={checkedTime.length} color="primary">
        <Button
          variant="outlined"
          endIcon={<KeyboardArrowDownIcon />}
          onClick={handleOpenTime}
        >
          Czas
        </Button>
      </Badge>
      <Menu
        sx={{ height: 400 }}
        open={timeOpen}
        onClose={() => setTimeOpen(false)}
        anchorEl={anchorTime}
      >
        {timeMarks.map((t) => (
          <ListItem key={t.value}>
            <ListItemButton onClick={() => toggleTimeChecked(t.value)}>
              <ListItemIcon>
                <Checkbox checked={checkedTime.includes(t.value)} />
              </ListItemIcon>
              <ListItemText id={t.value.toString()} primary={t.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </Menu>
      <Badge badgeContent={checkedDifficulty.length} color="primary">
        <Button
          variant="outlined"
          endIcon={<KeyboardArrowDownIcon />}
          onClick={handleOpenDifficulty}
        >
          Trudność
        </Button>
      </Badge>
      <Menu
        sx={{ height: 400 }}
        open={difficultyOpen}
        onClose={() => setDifficultyOpen(false)}
        anchorEl={anchorDifficulty}
      >
        {difficultyMarks.map((d) => (
          <ListItem key={d.value}>
            <ListItemButton onClick={() => toggleDifficultyChecked(d.value)}>
              <ListItemIcon>
                <Checkbox checked={checkedDifficulty.includes(d.value)} />
              </ListItemIcon>
              <ListItemText id={d.value.toString()} primary={d.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </Menu>
      <Button variant="outlined">
        <KitchenIcon />
      </Button>
      <Button variant="outlined">
        <NoMealsIcon />
      </Button>
      <Button variant="outlined" onClick={handleOpenSort}>
        <TuneIcon />
      </Button>
      <Menu
        sx={{ height: 400 }}
        open={sortOpen}
        onClose={() => setSortOpen(false)}
        anchorEl={anchorSort}
      >
        {SORT_OPTION.map((option) => (
          <ListItem key={option.value}>
            <ListItemButton onClick={() => toggleSortChecked(option.value)}>
              <ListItemIcon>
                <Radio checked={checkedSort === option.value} />
              </ListItemIcon>
              <ListItemText
                id={option.value.toString()}
                primary={option.name}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </Menu>
    </Stack>
  );
};
export default RecipeFilters;

type myProps = {
  categoriesList: ICategory[] | [];
  recipeList: RecipeType[] | [];
  onFilter: (recipe: RecipeType[]) => void;
};

const SORT_CONSTANTS = {
  LATEST: "LATEST",
  OLDEST: "OLDEST",
  FAVORITE: "FAVORITE",
  POPULAR: "POPULAR",
  ASCENDING: "ASCENDING",
  DESCENDING: "DESCENDING",
};

const SORT_OPTION = [
  { name: "Najnowsze", value: SORT_CONSTANTS.LATEST },
  { name: "Najstarsze", value: SORT_CONSTANTS.OLDEST },
  { name: "Najbardziej lubiane", value: SORT_CONSTANTS.FAVORITE },
  { name: "Najpopularniejsze", value: SORT_CONSTANTS.POPULAR },
  { name: "Alfabetycznie A-Z", value: SORT_CONSTANTS.ASCENDING },
  { name: "Alfabetycznie Z-A", value: SORT_CONSTANTS.DESCENDING },
];
