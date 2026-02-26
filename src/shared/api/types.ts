export type MigrantCategory = "PATENT_COUNTRY" | "EAEU" | "RVP_VNZH" | "STUDENT";
export type Citizenship =
    | "UZBEKISTAN" | "TAJIKISTAN" | "AZERBAIJAN" | "GEORGIA" | "MOLDOVA" | "UKRAINE"
    | "KYRGYZSTAN" | "KAZAKHSTAN" | "ARMENIA" | "BELARUS" | "OTHER";

export type MigrantDTO = {
    id?: number;
    lastNameRu: string;
    firstNameRu: string;
    middleNameRu?: string;
    birthDate?: string; // yyyy-mm-dd
    citizenship: Citizenship;
    category: MigrantCategory;
    phone?: string;
    email?: string;
    passportNumber?: string;
    patentNumber?: string;
    patentRegion?: string;
    patentPaymentDay?: number;
};

export type MigrantEventType = "CONTRACT_SIGNED" | "CONTRACT_TERMINATED" | "NOTIFICATION_SUBMITTED";

export type MigrantEventDTO = {
    id: number;
    eventType: MigrantEventType;
    eventDate: string; // yyyy-mm-dd
    categoryDefinitionId: number;
    createdAt: string;
};

export type ValidationResultDTO = {
    migrantId: number;
    eventId: number;
    categoryDefinitionId: number;
    missingRequired: string[];
    missingRecommended: string[];
    missingPeriodic: string[];
    ok: boolean;
};

export type CategoryDefinitionStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";

export type CategoryRequirementDTO = {
    id?: number;
    citizenship?: Citizenship;
    documentType: string;
    required: boolean;
    recommended: boolean;
    repeatPeriod?: "MONTHLY" | "YEARLY";
    notes?: string;
};

export type CategoryDefinitionDTO = {
    id: number;
    categoryType: MigrantCategory;
    version: number;
    effectiveFrom: string;
    effectiveTo?: string;
    status: CategoryDefinitionStatus;
    deleted: boolean;
    createdAt: string;
    comment?: string;
    requirements?: CategoryRequirementDTO[];
};