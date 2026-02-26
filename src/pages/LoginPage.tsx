import { useState } from "react";
import { http } from "../shared/api/http";
import { endpoints } from "../shared/api/endpoints";
import { Button, Container, TextField, Typography, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

export function LoginPage() {
    const nav = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState<string | null>(null);

    async function onLogin() {
        setErr(null);
        try {
            await http.post(endpoints.auth.login, { email, password });
            nav("/");
        } catch (e: any) {
            setErr(e?.response?.data?.message ?? "Login failed");
        }
    }

    return (
        <Container maxWidth="sm" sx={{ py: 6 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>Login</Typography>
            <Stack spacing={2}>
                <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                {err && <Typography color="error">{err}</Typography>}
                <Button variant="contained" onClick={onLogin}>Sign in</Button>
            </Stack>
        </Container>
    );
}