import { TUser } from "../../types/user/TUser";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import EmptyState from "../common/EmptyState";

const ShoppingList = ({
  user,
  open,
  onClose,
  onDelete,
  onDownload,
}: myProps) => {
  const [selectedIngredients, setSelectedIngredients] = useState<string[] | []>(
    []
  );

  const handleIngredientSelect = (id: string) => {
    if (selectedIngredients.find((ing) => ing === id)) {
      setSelectedIngredients((prev) => prev.filter((ing) => ing !== id));
    } else {
      setSelectedIngredients((prev) => [...prev, id]);
    }
  };

  const handleDelete = async () => {
    onDelete(selectedIngredients);
    setSelectedIngredients([]);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Lista brakujących składników</DialogTitle>
      <DialogContent>
        <List sx={{ width: 500, maxHeight: 400, overflowY: "scroll" }}>
          {user.shoppingList.map((i, index) => (
            <Box key={index}>
              <ListItem key={index} sx={{ p: 0 }}>
                <ListItemButton onClick={() => handleIngredientSelect(i.id)}>
                  <ListItemIcon>
                    <Checkbox
                      checked={
                        !!selectedIngredients.find((ing) => ing === i.id)
                      }
                    />
                  </ListItemIcon>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                      px: 1,
                      py: 0.25,
                      width: "100%",
                    }}
                    key={index}
                  >
                    <Typography
                      sx={{
                        fontSize: { xs: 16, sm: 20 },
                        textTransform: "uppercase",
                        letterSpacing: { sm: 1 },
                        maxWidth: "70%",
                      }}
                    >
                      {i.name}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: 16, sm: 20 },
                        maxWidth: "30%",
                        textAlign: "end",
                      }}
                    >
                      {i.amount}
                    </Typography>
                  </Stack>
                </ListItemButton>
              </ListItem>
              <Divider />
            </Box>
          ))}
          {user.shoppingList.length === 0 && (
            <EmptyState message="Brak zapisanych składników" />
          )}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Zamknij
        </Button>
        <Button
          onClick={handleDelete}
          variant="contained"
          disabled={selectedIngredients.length === 0}
          sx={{ color: (theme) => theme.palette.text.light }}
        >
          Usuń
        </Button>
        <Button
          onClick={onDownload}
          disabled={user.shoppingList.length === 0}
          variant="contained"
          sx={{ color: (theme) => theme.palette.text.light }}
        >
          Pobierz
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default ShoppingList;

type myProps = {
  user: TUser;
  open: boolean;
  onClose: () => void;
  onDelete: (ingredients: string[]) => void;
  onDownload: () => void;
};
