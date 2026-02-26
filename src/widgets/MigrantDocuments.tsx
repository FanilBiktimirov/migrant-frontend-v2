import { useMutation } from "@tanstack/react-query";
import { http } from "../shared/api/http";
import { endpoints } from "../shared/api/endpoints";
import { Button, Stack, Typography, TextField } from "@mui/material";
import { useState } from "react";

export function MigrantDocuments({ migrantId }: { migrantId: number }) {
    const [documentType, setDocumentType] = useState("PASSPORT_MAIN");
    const [periodKey, setPeriodKey] = useState<string>(""); // yyyy-mm for monthly receipts
    const [file, setFile] = useState<File | null>(null);

    const uploadM = useMutation({
        mutationFn: async () => {
            if (!file) throw new Error("No file selected");
            const form = new FormData();
            form.append("documentType", documentType);
            if (periodKey) form.append("periodKey", periodKey);
            form.append("file", file);
            await http.post(endpoints.documents.upload(migrantId), form, {
                headers: { "Content-Type": "multipart/form-data" },
            });
        },
    });

    return (
        <Stack spacing={1}>
            <Typography variant="h6">Документы</Typography>
            <Stack direction="row" spacing={1} alignItems="center">
                <TextField size="small" label="Тип документа" value={documentType} onChange={(e) => setDocumentType(e.target.value)} sx={{ minWidth: 240 }} />
                <TextField size="small" label="Период (YYYY-MM)" value={periodKey} onChange={(e) => setPeriodKey(e.target.value)} sx={{ width: 180 }} />
                <Button component="label" variant="outlined">
                    Выбрать файл
                    <input hidden type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                </Button>
                <Button variant="contained" disabled={!file || uploadM.isPending} onClick={() => uploadM.mutate()}>
                    Загрузить
                </Button>
            </Stack>
            {file && <Typography variant="body2">Выбрано: {file.name}</Typography>}
            {uploadM.isError && <Typography color="error">Ошибка загрузки</Typography>}
            {uploadM.isSuccess && <Typography color="success.main">Загружено</Typography>}
        </Stack>
    );
}