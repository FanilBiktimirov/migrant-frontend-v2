import { useMutation, useQuery } from "@tanstack/react-query";
import { http } from "../shared/api/http";
import { endpoints } from "../shared/api/endpoints";
import type { CategoryDefinitionDTO, CategoryRequirementDTO, MigrantCategory } from "../shared/api/types";
import { queryClient } from "../app/queryClient";
import { Button, Container, Stack, Typography, TextField, MenuItem, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";
import { useState } from "react";

const categories: MigrantCategory[] = ["PATENT_COUNTRY", "EAEU", "RVP_VNZH", "STUDENT"];

export function AdminCategoriesPage() {
    const [categoryType, setCategoryType] = useState<MigrantCategory>("EAEU");
    const [effectiveFrom, setEffectiveFrom] = useState<string>(new Date().toISOString().slice(0, 10));
    const [comment, setComment] = useState<string>("");

    const [selectedDefId, setSelectedDefId] = useState<number | null>(null);

    const listQ = useQuery({
        queryKey: ["adminCategories", categoryType],
        queryFn: async () =>
            (await http.get<CategoryDefinitionDTO[]>(endpoints.adminDict.listVersions, { params: { categoryType } })).data,
    });

    const createM = useMutation({
        mutationFn: async () =>
            (await http.post<CategoryDefinitionDTO>(endpoints.adminDict.createVersion, { categoryType, effectiveFrom, comment })).data,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminCategories", categoryType] }),
    });

    const activateM = useMutation({
        mutationFn: async (id: number) =>
            (await http.post<CategoryDefinitionDTO>(endpoints.adminDict.activate(id))).data,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminCategories", categoryType] }),
    });

    // requirement quick form
    const [req, setReq] = useState<CategoryRequirementDTO>({
        documentType: "PASSPORT_MAIN",
        required: true,
        recommended: false,
    });

    const upsertReqM = useMutation({
        mutationFn: async () => {
            if (!selectedDefId) throw new Error("Select version");
            await http.post(endpoints.adminDict.upsertRequirement(selectedDefId), req);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminCategories", categoryType] }),
    });

    const defs = listQ.data ?? [];
    const selected = defs.find((d) => d.id === selectedDefId) ?? null;

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Stack spacing={2}>
                <Typography variant="h5">Admin: Category dictionary</Typography>

                <Stack direction="row" spacing={1} alignItems="center">
                    <TextField select size="small" label="CategoryType" value={categoryType} onChange={(e) => setCategoryType(e.target.value as MigrantCategory)} sx={{ minWidth: 240 }}>
                        {categories.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                    </TextField>
                    <TextField size="small" label="EffectiveFrom" type="date" InputLabelProps={{ shrink: true }} value={effectiveFrom} onChange={(e) => setEffectiveFrom(e.target.value)} />
                    <TextField size="small" label="Comment" value={comment} onChange={(e) => setComment(e.target.value)} sx={{ minWidth: 260 }} />
                    <Button variant="contained" onClick={() => createM.mutate()}>Create DRAFT</Button>
                </Stack>

                <Paper variant="outlined">
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Version</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Deleted</TableCell>
                                <TableCell>Effective</TableCell>
                                <TableCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {defs.map((d) => (
                                <TableRow key={d.id} selected={d.id === selectedDefId} onClick={() => setSelectedDefId(d.id)} sx={{ cursor: "pointer" }}>
                                    <TableCell>{d.id}</TableCell>
                                    <TableCell>{d.version}</TableCell>
                                    <TableCell>{d.status}</TableCell>
                                    <TableCell>{String(d.deleted)}</TableCell>
                                    <TableCell>{d.effectiveFrom} → {d.effectiveTo ?? "∞"}</TableCell>
                                    <TableCell>
                                        {d.status === "DRAFT" && (
                                            <Button size="small" variant="contained" onClick={(e) => { e.stopPropagation(); activateM.mutate(d.id); }}>
                                                Activate
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>

                <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="h6">Requirements (selected version: {selectedDefId ?? "-"})</Typography>

                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                        <TextField size="small" label="DocumentType" value={req.documentType} onChange={(e) => setReq({ ...req, documentType: e.target.value })} sx={{ minWidth: 240 }} />
                        <TextField size="small" label="Citizenship (optional)" value={req.citizenship ?? ""} onChange={(e) => setReq({ ...req, citizenship: (e.target.value || undefined) as any })} sx={{ width: 220 }} />
                        <TextField size="small" label="RepeatPeriod" value={req.repeatPeriod ?? ""} onChange={(e) => setReq({ ...req, repeatPeriod: (e.target.value || undefined) as any })} sx={{ width: 160 }} />
                        <TextField size="small" label="Required" value={String(req.required)} onChange={(e) => setReq({ ...req, required: e.target.value === "true" })} sx={{ width: 120 }} />
                        <TextField size="small" label="Recommended" value={String(req.recommended)} onChange={(e) => setReq({ ...req, recommended: e.target.value === "true" })} sx={{ width: 140 }} />
                        <Button variant="contained" disabled={!selectedDefId} onClick={() => upsertReqM.mutate()}>
                            Upsert requirement
                        </Button>
                    </Stack>

                    <Typography sx={{ mt: 2 }}>Current requirements (read-only view from API response):</Typography>
                    <pre style={{ margin: 0, maxHeight: 260, overflow: "auto" }}>
            {JSON.stringify(selected?.requirements ?? [], null, 2)}
          </pre>
                </Paper>
            </Stack>
        </Container>
    );
}