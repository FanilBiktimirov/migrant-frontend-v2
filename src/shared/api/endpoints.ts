export const endpoints = {
    auth: {
        login: "/auth/base_auth",
        currentUser: "/user/current",
    },

    migrants: {
        base: "/migrant",
        byId: (id: number) => `/migrant/${id}`,
    },

    events: {
        list: (migrantId: number) => `/migrant/${migrantId}/event`,
        create: (migrantId: number) => `/migrant/${migrantId}/event`,
        validate: (migrantId: number, eventId: number) => `/migrant/${migrantId}/event/${eventId}/validate`,
    },

    documents: {
        upload: (migrantId: number) => `/migrant/${migrantId}/document`,
        // list: (migrantId: number) => `/migrant/${migrantId}/document`,
    },

    dict: {
        activeOnDate: "/dict/category/active",
        byId: (id: number) => `/dict/category/${id}`,
    },

    adminDict: {
        listVersions: "/admin/dict/category",
        createVersion: "/admin/dict/category",
        updateDraft: (id: number) => `/admin/dict/category/${id}`,
        activate: (id: number) => `/admin/dict/category/${id}/activate`,
        upsertRequirement: (id: number) => `/admin/dict/category/${id}/requirement`,
        deleteRequirement: (id: number, reqId: number) => `/admin/dict/category/${id}/requirement/${reqId}`,
    },
};