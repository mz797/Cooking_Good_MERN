import {
  Avatar,
  Button,
  ButtonGroup,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ICategory } from "../../../types/category-types";
import LoadingProgress from "../../../Components/common/LoadingProgress";

const RecipesTable = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  console.log(categoryId);

  const [category, setCategory] = useState<ICategory | null>(null);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`http://localhost:8080/category/${categoryId}`)
      .then((res) => {
        setCategory(res.data.category);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  }, [categoryId]);

  if (isLoading) return <LoadingProgress />;
  return (
    <Container sx={{ mt: 4 }}>
      <Typography
        variant="h3"
        sx={{ color: (theme) => theme.palette.primary.main, mb: 2 }}
      >
        Kategoria: {!!category && category.name}
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Np.</TableCell>
              <TableCell>Nazwa</TableCell>
              <TableCell>Autor</TableCell>
              <TableCell>Obraz</TableCell>
              <TableCell>Akcje</TableCell>
            </TableRow>
          </TableHead>
          {!!category && category.recipes.length > 0 && (
            <TableBody>
              {category.recipes.map((recipe, index) => (
                <TableRow key={recipe.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{recipe.name}</TableCell>
                  <TableCell>{recipe.creator.name}</TableCell>
                  <TableCell>
                    <Avatar
                      sx={{ width: 60, height: 60 }}
                      variant="rounded"
                      src={`http://localhost:8080/${recipe.image}`}
                    />{" "}
                  </TableCell>
                  <TableCell>
                    <ButtonGroup>
                      <Button
                        onClick={() => {
                          navigate(`/recipes/${recipe.id}`);
                        }}
                      >
                        Pokaż przepis
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

export default RecipesTable;
