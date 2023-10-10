import { Box, Stack, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { loadCategories } from "../../store/actions/CategoryActions";
import { useAppDispatch, useAppSelector } from "../../store/store";

const CategoryLinks = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.categories.categoryList);

  useEffect(() => {
    dispatch(loadCategories());
  }, []);

  return (
    <Stack direction="row" sx={{ mb: 2 }}>
      {!!categories &&
        categories.map((c) => (
          <Box
            key={c.id}
            component={Link}
            to={"/category/" + c.id}
            sx={{
              m: 1,
              overflow: "hidden",
              borderRadius: "50%",
              width: 170,
              height: 150,
              backgroundSize: "cover",
              backgroundImage: `url('http://localhost:8080/${c.image.replace(
                "\\",
                "/"
              )}')`,
              backgroundPosition: "center",
              textDecoration: "none",
              textShadow: "0 0 24px #000",
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: "100%",
                background: "rgba(0,0,0,.4)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography
                variant="button"
                sx={{
                  color: (theme) => theme.palette.text.light,
                  textAlign: "center",
                  fontSize: 18,
                  textShadow: (theme) => `0 0 5px ${theme.palette.text.dark}`,
                }}
              >
                {c.name}
              </Typography>
            </Box>
          </Box>
        ))}
    </Stack>
  );
};

export default CategoryLinks;
