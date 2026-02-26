import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, TextField, MenuItem } from "@mui/material";
import type { MigrantDTO, MigrantCategory, Citizenship } from "../shared/api/types";
import { useState } from "react";
import {categoryLabel, citizenshipLabel} from "../shared/i18n/labels.ts";

const categories: MigrantCategory[] = ["PATENT_COUNTRY", "EAEU", "RVP_VNZH", "STUDENT"];
const citizenships: Citizenship[] = ["UZBEKISTAN","TAJIKISTAN","AZERBAIJAN","GEORGIA","MOLDOVA","UKRAINE","KYRGYZSTAN","KAZAKHSTAN","ARMENIA","BELARUS","OTHER"];

export function MigrantForm(props: {
    open: boolean;
    onClose: () => void;
    onSubmit: (dto: MigrantDTO) => void;
}) {
    const [form, setForm] = useState<MigrantDTO>({
        lastNameRu: "",
        firstNameRu: "",
        citizenship: "OTHER",
        category: "EAEU",
    } as MigrantDTO);

    return (
        <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth="sm">
            <DialogTitle>Create migrant</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ pt: 1 }}>
                    <TextField label="Фамилия (RU)" value={form.lastNameRu} onChange={(e) => setForm({ ...form, lastNameRu: e.target.value })} />
                    <TextField label="Имя (RU)" value={form.firstNameRu} onChange={(e) => setForm({ ...form, firstNameRu: e.target.value })} />
                    <TextField label="Отчество (RU)" value={form.middleNameRu ?? ""} onChange={(e) => setForm({ ...form, middleNameRu: e.target.value })} />
                    <TextField label="Дата рождения" type="date" InputLabelProps={{ shrink: true }} value={form.birthDate ?? ""} onChange={(e) => setForm({ ...form, birthDate: e.target.value })} />

                    <TextField select label="Категория" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as MigrantCategory })}>
                        {categories.map((c) => (
                            <MenuItem key={c} value={c}>
                                {categoryLabel[c]}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField select label="Гражданство" value={form.citizenship} onChange={(e) => setForm({ ...form, citizenship: e.target.value as Citizenship })}>
                        {citizenships.map((c) => (
                            <MenuItem key={c} value={c}>
                                {citizenshipLabel[c]}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField label="Телефон" value={form.phone ?? ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                    <TextField label="email" value={form.email ?? ""} onChange={(e) => setForm({ ...form, email: e.target.value })} />

                    {/* патентные поля */}
                    <TextField label="Номер патента" value={form.patentNumber ?? ""} onChange={(e) => setForm({ ...form, patentNumber: e.target.value })} />
                    <TextField label="Регион патента" value={form.patentRegion ?? ""} onChange={(e) => setForm({ ...form, patentRegion: e.target.value })} />
                    <TextField label="День платежа патента" type="number" value={form.patentPaymentDay ?? ""} onChange={(e) => setForm({ ...form, patentPaymentDay: Number(e.target.value) })} />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose}>Cancel</Button>
                <Button variant="contained" onClick={() => props.onSubmit(form)}>Create</Button>
            </DialogActions>
        </Dialog>
    );
}