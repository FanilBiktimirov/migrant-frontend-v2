import { useQuery, useMutation } from "@tanstack/react-query";
import { http } from "../shared/api/http";
import { endpoints } from "../shared/api/endpoints";
import type {MigrantEventDTO, MigrantEventType} from "../shared/api/types";
import { queryClient } from "../app/queryClient";
import { Button, Stack, Typography, TextField, MenuItem, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { useState } from "react";
import {eventTypeLabel} from "../shared/i18n/labels.ts";

const eventTypes: MigrantEventType[] = ["CONTRACT_SIGNED","CONTRACT_TERMINATED","NOTIFICATION_SUBMITTED"];

export function MigrantEvents({ migrantId }: { migrantId: number }) {
    const [eventType, setEventType] = useState<MigrantEventType>("CONTRACT_SIGNED");
    const [eventDate, setEventDate] = useState<string>(new Date().toISOString().slice(0, 10));

    const listQ = useQuery({
        queryKey: ["events", migrantId],
        queryFn: async () => (await http.get<MigrantEventDTO[]>(endpoints.events.list(migrantId))).data,
    });

    const createM = useMutation({
        mutationFn: async () => (await http.post(endpoints.events.create(migrantId), { eventType, eventDate })).data,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events", migrantId] }),
    });

    return (
        <Stack spacing={1}>
            <Typography variant="h6">События</Typography>

            <Stack direction="row" spacing={1} alignItems="center">
                <TextField select size="small" label="Тип события" value={eventType} onChange={(e) => setEventType(e.target.value as MigrantEventType)} sx={{ minWidth: 220 }}>
                    {eventTypes.map((c) => (
                        <MenuItem key={c} value={c}>
                            {eventTypeLabel[c]}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField size="small" label="Дата" type="date" InputLabelProps={{ shrink: true }} value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
                <Button variant="contained" onClick={() => createM.mutate()}>Добавить событие</Button>
            </Stack>

            {listQ.data && (
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Тип</TableCell>
                            <TableCell>Дата</TableCell>
                            <TableCell>Идентификатор категории</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {listQ.data.map((e) => (
                            <TableRow key={e.id}>
                                <TableCell>{e.id}</TableCell>
                                <TableCell>{e.eventType}</TableCell>
                                <TableCell>{e.eventDate}</TableCell>
                                <TableCell>{e.categoryDefinitionId}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </Stack>
    );
}