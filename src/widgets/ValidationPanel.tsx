import { useQuery, useMutation } from "@tanstack/react-query";
import { http } from "../shared/api/http";
import { endpoints } from "../shared/api/endpoints";
import type {MigrantEventDTO, ValidationResultDTO} from "../shared/api/types";
import { Button, Stack, Typography, TextField, MenuItem, Paper } from "@mui/material";
import { useState } from "react";

export function ValidationPanel({ migrantId }: { migrantId: number }) {
    const [eventId, setEventId] = useState<number | null>(null);

    const eventsQ = useQuery({
        queryKey: ["events", migrantId],
        queryFn: async () => (await http.get<MigrantEventDTO[]>(endpoints.events.list(migrantId))).data,
    });

    const validateM = useMutation({
        mutationFn: async () => {
            if (!eventId) throw new Error("Select event");
            return (await http.post<ValidationResultDTO>(endpoints.events.validate(migrantId, eventId))).data;
        },
    });

    return (
        <Stack spacing={1}>
            <Typography variant="h6">Validation</Typography>

            <Stack direction="row" spacing={1} alignItems="center">
                <TextField
                    select
                    size="small"
                    label="Event"
                    value={eventId ?? ""}
                    onChange={(e) => setEventId(Number(e.target.value))}
                    sx={{ minWidth: 300 }}
                >
                    {(eventsQ.data ?? []).map((e) => (
                        <MenuItem key={e.id} value={e.id}>
                            #{e.id} {e.eventType} {e.eventDate}
                        </MenuItem>
                    ))}
                </TextField>

                <Button variant="contained" disabled={!eventId || validateM.isPending} onClick={() => validateM.mutate()}>
                    Validate
                </Button>
            </Stack>

            {validateM.data && (
                <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography>OK: {String(validateM.data.ok)}</Typography>
                    <Typography>CategoryDefinitionId: {validateM.data.categoryDefinitionId}</Typography>

                    <Typography sx={{ mt: 1 }}>Missing required:</Typography>
                    <pre style={{ margin: 0 }}>{JSON.stringify(validateM.data.missingRequired, null, 2)}</pre>

                    <Typography sx={{ mt: 1 }}>Missing recommended:</Typography>
                    <pre style={{ margin: 0 }}>{JSON.stringify(validateM.data.missingRecommended, null, 2)}</pre>

                    <Typography sx={{ mt: 1 }}>Missing periodic:</Typography>
                    <pre style={{ margin: 0 }}>{JSON.stringify(validateM.data.missingPeriodic, null, 2)}</pre>
                </Paper>
            )}
        </Stack>
    );
}