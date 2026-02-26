import { useQuery, useMutation } from "@tanstack/react-query";
import { http } from "../shared/api/http";
import { endpoints } from "../shared/api/endpoints";
import type { MigrantDTO } from "../shared/api/types";
import { queryClient } from "../app/queryClient";
import {
    Button,
    Container,
    Stack,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Pagination,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { MigrantForm } from "../widgets/MigrantForm";
import { useState } from "react";

type Page<T> = {
    content: T[];
    totalPages: number;
    totalElements: number;
    number: number; // текущая страница (0-based)
    size: number;
    first: boolean;
    last: boolean;
    empty: boolean;
};

export function MigrantsPage() {
    const nav = useNavigate();
    const [open, setOpen] = useState(false);

    // UI pagination (MUI Pagination is 1-based)
    const [page, setPage] = useState(1);
    const size = 20;

    const migrantsQ = useQuery({
        queryKey: ["migrants", page, size],
        queryFn: async () =>
            (
                await http.get<Page<MigrantDTO>>(endpoints.migrants.base, {
                    params: { page: page - 1, size },
                })
            ).data,
    });

    const createM = useMutation({
        mutationFn: async (dto: MigrantDTO) =>
            (await http.post<MigrantDTO>(endpoints.migrants.base, dto)).data,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["migrants"] });
            setOpen(false);
            setPage(1);
        },
    });

    const migrants = migrantsQ.data?.content ?? [];

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 2 }}
            >
                <Typography variant="h5">Мигранты</Typography>
                <Stack direction="row" spacing={1}>
                    <Button onClick={() => nav("/admin/categories")}>
                        Админ панель: Категории
                    </Button>
                    <Button variant="contained" onClick={() => setOpen(true)}>
                        Добавить мигранта
                    </Button>
                </Stack>
            </Stack>

            <MigrantForm
                open={open}
                onClose={() => setOpen(false)}
                onSubmit={(dto) => createM.mutate(dto)}
            />

            {migrantsQ.isLoading && <Typography>Загрузка...</Typography>}
            {migrantsQ.error && (
                <Typography color="error">Ошибка загрузки</Typography>
            )}

            {!migrantsQ.isLoading && migrants.length === 0 && (
                <Typography>Нет данных</Typography>
            )}

            {migrants.length > 0 && (
                <>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ФИО</TableCell>
                                <TableCell>Категория</TableCell>
                                <TableCell>Гражданство</TableCell>
                                <TableCell>Номер телефона</TableCell>
                                <TableCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {migrants.map((m) => (
                                <TableRow key={m.id}>
                                    <TableCell>
                                        {m.lastNameRu} {m.firstNameRu} {m.middleNameRu ?? ""}
                                    </TableCell>
                                    <TableCell>{m.category}</TableCell>
                                    <TableCell>{m.citizenship}</TableCell>
                                    <TableCell>{m.phone ?? "-"}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => nav(`/migrants/${m.id}`)}>
                                            Открыть
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {(migrantsQ.data?.totalPages ?? 1) > 1 && (
                        <Stack sx={{ mt: 2 }} alignItems="center">
                            <Pagination
                                count={migrantsQ.data?.totalPages ?? 1}
                                page={page}
                                onChange={(_, p) => setPage(p)}
                            />
                        </Stack>
                    )}
                </>
            )}
        </Container>
    );
}