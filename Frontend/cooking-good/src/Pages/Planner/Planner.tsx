import {
  Box,
  Chip,
  Container,
  List,
  ListItem,
  Paper,
  Stack,
  Tooltip,
} from "@mui/material";
import { Calendar, ConfigProvider, theme } from "antd";
import locale from "antd/es/date-picker/locale/pl_PL";
import "dayjs/locale/pl";
import dayjs, { Dayjs } from "dayjs";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { useEffect, useState } from "react";
import { RecipeType } from "../../types/recipe-types";
import axios from "axios";
import RamenDiningIcon from "@mui/icons-material/RamenDining";
import { loadPlanner } from "../../store/reducers/PlannerReducer";

const Planner = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const darkMode = useAppSelector((state) => state.theme.darkMode);
  const [planner, setPlanner] = useState<
    {
      date: string;
      recipes: RecipeType[];
    }[]
  >([]);

  useEffect(() => {
    const loadData = async () => {
      const response = await axios.get(
        `http://localhost:8080/users/planner/${user?.userId}`
      );
      if (response.status === 200) {
        setPlanner(response.data.planner);
        dispatch(loadPlanner({ planner: response.data.planner }));
      }
    };
    loadData();
  }, []);
  console.log(planner);

  const handleNavigate = (date: string) => {
    navigate(`/planner/${date}`);
  };
  const renderCellDate = (date: dayjs.Dayjs) => {
    const plan = planner.find(
      (plan) => plan.date === dayjs(date).format("DD-MM-YYYY")
    );
    console.log(plan?.recipes);
    if (!!plan && plan.recipes.length > 0)
      return (
        <Stack
          justifyContent="center"
          alignItems="center"
          sx={{ height: "100%" }}
        >
          <Tooltip
            arrow
            title={
              <List>
                {plan.recipes.map((recipe) => (
                  <ListItem>{recipe.name}</ListItem>
                ))}
              </List>
            }
          >
            <Chip
              sx={{ mb: 1 }}
              label={plan.recipes.length}
              icon={
                <RamenDiningIcon
                  color="primary"
                  sx={{ color: (theme) => theme.palette.primary.main }}
                />
              }
            />
          </Tooltip>
        </Stack>
      );
    return <></>;
  };
  return (
    <Box sx={{ background: (theme) => theme.palette.background.darker }}>
      <Container sx={{ py: 6 }}>
        <Paper sx={{ p: 2, background: darkMode ? "#141414" : "" }}>
          <ConfigProvider
            theme={{
              algorithm: darkMode
                ? theme.darkAlgorithm
                : theme.defaultAlgorithm,
              token: {
                colorPrimary: "#30b470",
              },
            }}
          >
            <Calendar
              locale={locale}
              onSelect={(date: Dayjs) =>
                handleNavigate(dayjs(date).format("DD-MM-YYYY"))
              }
              disabledDate={(date) => {
                const plan = planner.find(
                  (plan) => plan.date === dayjs(date).format("DD-MM-YYYY")
                );
                if (!plan) return true;
                return false;
              }}
              dateCellRender={renderCellDate}
            />
          </ConfigProvider>
        </Paper>
      </Container>
    </Box>
  );
};
export default Planner;
