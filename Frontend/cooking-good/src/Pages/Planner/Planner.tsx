import { Box, Container, Paper } from "@mui/material";
import { Calendar, ConfigProvider, theme } from "antd";
import locale from "antd/es/date-picker/locale/pl_PL";
import "dayjs/locale/pl";
import dayjs, { Dayjs } from "dayjs";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../store/store";

const Planner = () => {
  const navigate = useNavigate();
  const darkMode = useAppSelector((state) => state.theme.darkMode);

  const handleNavigate = (date: string) => {
    navigate(`/planner/${date}`);
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
            }}
          >
            <Calendar
              locale={locale}
              onSelect={(date: Dayjs) =>
                handleNavigate(dayjs(date).format("DD-MM-YYYY"))
              }
            />
          </ConfigProvider>
        </Paper>
      </Container>
    </Box>
  );
};
export default Planner;
