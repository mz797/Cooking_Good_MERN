import {
	Avatar,
	Box,
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
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import EmptyState from "../../../Components/common/EmptyState";
import { RootState } from "../../../store/store";
import { IReport } from "../../../types/report-types";
import { TUser } from "../../../types/user/TUser";

const ReportsPage = () => {
	const navigate = useNavigate();
	const token = useSelector((state: RootState) => state.auth.token);
	const [reports, setReports] = useState<IReport[] | []>([]);

	useEffect(() => {
		fetchReports();
	}, []);

	const fetchReports = () => {
		axios
			.get("http://localhost:8080/report")
			.then((res) => {
				setReports(res.data.reports);
			})
			.catch((err) => console.log(err));
	};

	const handleRemoveReport = (reportId: string) => {
		axios
			.delete(`http://localhost:8080/report/${reportId}`)
			.then((res) => {
				console.log(res.data);
				setReports((prev) => prev.filter((r) => r.id !== reportId));
			})
			.catch((err) => console.log(err));
	};

	const handleRemoveComment = (report: IReport) => {
		axios
			.delete(
				`http://localhost:8080/recipe/comment/${report.recipe.id}/${report.comment.id}`,
				{ headers: { Authorization: "Bearer " + token } }
			)
			.then((res) => {
				console.log(res.data);
				fetchReports();
			})
			.catch((err) => console.log(err));
	};
	const handleBlockUser = async (userId: TUser) => {
		const newStatus = "banned";
		const response = await axios.put(
			`http://localhost:8080/users/status/${userId}`,
			{ status: newStatus },
			{ headers: { Authorization: "Bearer " + token } }
		);
		console.log(response);
	};

	return (
		<Container sx={{ mt: 4 }}>
				{reports.length > 0 ? (
			<TableContainer component={Paper}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Np.</TableCell>
								<TableCell>Komantarz</TableCell>
								<TableCell>Autor komentarza</TableCell>
								<TableCell>Akcje</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{reports.map((report, index) => (
								<TableRow key={report.id}>
									<TableCell>{index + 1}</TableCell>
									<TableCell>
										{report.comment.content}
									</TableCell>
									<TableCell>
										{report.comment.creator.name}
									</TableCell>
									<TableCell>
										<Button
											onClick={() =>
												handleRemoveReport(report.id)
											}>
											Usuń zgłoszenie
										</Button>
										<Button
											onClick={() =>
												handleRemoveComment(report)
											}>
											Usuń komentarz
										</Button>
										<Button
											onClick={() => {
												handleRemoveComment(report);
												handleBlockUser(
													report.comment.creator._id
												);
											}}>
											Usuń komentarz i zablokuj autora
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
			</TableContainer>
				) : (
					<EmptyState message={"Nie znaleziono żadnych raportów."} />
				)}
		</Container>
	);
};

export default ReportsPage;
