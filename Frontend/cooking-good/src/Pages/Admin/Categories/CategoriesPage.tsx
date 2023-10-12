import {
  Avatar,
  Button,
  ButtonGroup,
  Container,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddCategory from "../../../Components/Category/AddCategory";
import { ICategory } from "../../../types/category-types";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import {
  deleteCategoryAsync,
  loadCategories,
} from "../../../store/actions/CategoryActions";

const CategoriesPage = () => {
  const dispatch = useAppDispatch();
  const categoryList = useAppSelector((state) => state.categories.categoryList);
  const navigate = useNavigate();
  const [openAddCategory, setOpenAddCategory] = useState<boolean>(false);
  const [categories, setCategories] = useState<ICategory[]>([]);
  useEffect(() => {
    dispatch(loadCategories());
  }, []);
  useEffect(() => {
    setCategories(categoryList);
  }, [categoryList]);

  const handleCategoryAdded = () => {
    dispatch(loadCategories());
  };
  const handleCategoryDelete = (categoryId: string) => {
    dispatch(deleteCategoryAsync(categoryId));
  };

  const handleOpenAddCategory = () => {
    setOpenAddCategory(true);
  };
  const handleCloseAddCategory = () => {
    setOpenAddCategory(false);
  };

  return (
    <Container sx={{ py: 4 }}>
      <Stack alignItems="end" sx={{ m: 1 }}>
        <Button
          sx={{ color: (theme) => theme.palette.text.light, alignSelf: "end" }}
          variant="contained"
          onClick={handleOpenAddCategory}
        >
          Dodaj kategorię
        </Button>
      </Stack>
      <AddCategory
        open={openAddCategory}
        onClose={handleCloseAddCategory}
        onSave={handleCategoryAdded}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Np.</TableCell>
              <TableCell>Nazwa</TableCell>
              <TableCell>Przepisy</TableCell>
              <TableCell>Obraz</TableCell>
              <TableCell>Akcje</TableCell>
            </TableRow>
          </TableHead>
          {categories.length > 0 && (
            <TableBody>
              {categories.map((category, index) => (
                <TableRow key={category.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.recipes.length}</TableCell>
                  <TableCell>
                    <Avatar
                      sx={{ width: 60, height: 60 }}
                      variant="rounded"
                      src={`http://localhost:8080/${category.image}`}
                    />{" "}
                  </TableCell>
                  <TableCell>
                    <ButtonGroup>
                      <Button>Edytuj</Button>
                      <Button onClick={() => handleCategoryDelete(category.id)}>
                        Usuń
                      </Button>
                      <Button
                        onClick={() =>
                          navigate(`/recipes/category/${category.id}`, {
                            relative: "path",
                          })
                        }
                        // to={`recipes/category/${category.id}`}
                      >
                        Pokaż przepisy
                      </Button>
                    </ButtonGroup>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </TableContainer>
    </Container>
  );
};

export default CategoriesPage;
