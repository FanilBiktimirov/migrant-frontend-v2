import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { http } from "../shared/api/http";
import { endpoints } from "../shared/api/endpoints";
import type { MigrantDTO } from "../shared/api/types";
import { Container, Stack, Typography, Divider } from "@mui/material";
import { MigrantEvents } from "../widgets/MigrantEvents";
import { MigrantDocuments } from "../widgets/MigrantDocuments";
import { ValidationPanel } from "../widgets/ValidationPanel";

export function MigrantDetailsPage() {
    const id = Number(useParams().id);

    const migrantQ = useQuery({
        queryKey: ["migrant", id],
        queryFn: async () => (await http.get<MigrantDTO>(endpoints.migrants.byId(id))).data,
        enabled: Number.isFinite(id),
    });

    if (!Number.isFinite(id)) return <Container sx={{ py: 4 }}>Bad id</Container>;

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {migrantQ.isLoading && <Typography>Loading...</Typography>}
            {migrantQ.data && (
                <Stack spacing={2}>
                    <Typography variant="h5">
                        {migrantQ.data.lastNameRu} {migrantQ.data.firstNameRu} {migrantQ.data.middleNameRu ?? ""}
                    </Typography>
                    <Typography>
                        Category: {migrantQ.data.category} | Citizenship: {migrantQ.data.citizenship}
                    </Typography>

                    <Divider />

                    <MigrantDocuments migrantId={id} />

                    <Divider />

                    <MigrantEvents migrantId={id} />

                    <Divider />

                    <ValidationPanel migrantId={id} />
                </Stack>
            )}
        </Container>
    );
}