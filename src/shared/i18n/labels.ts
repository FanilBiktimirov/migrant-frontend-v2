import type {MigrantCategory, Citizenship, MigrantEventType, CategoryDefinitionStatus} from "../api/types";

export const categoryLabel: Record<MigrantCategory, string> = {
    PATENT_COUNTRY: "Патент",
    EAEU: "ЕАЭС",
    RVP_VNZH: "РВП / ВНЖ",
    STUDENT: "Иностранные студенты",
};

export const eventTypeLabel: Record<MigrantEventType, string> = {
    CONTRACT_SIGNED: "Заключение договора",
    CONTRACT_TERMINATED: "Расторжение договора",
    NOTIFICATION_SUBMITTED: "Уведомление подано",
};

// если нужно
export const citizenshipLabel: Partial<Record<Citizenship, string>> = {
    UZBEKISTAN: "Узбекистан",
    TAJIKISTAN: "Таджикистан",
    KAZAKHSTAN: "Казахстан",
    BELARUS: "Беларусь",
    OTHER: "Другая",
};

export const statusLabel: Partial<Record<CategoryDefinitionStatus, string>> = {
    DRAFT: "Черновик",
    ACTIVE: "Активный",
    ARCHIVED: "Архив"
};