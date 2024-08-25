export const sortColumnsToDbColumns = {
    id: "d.id",
    name: "d.name",
    user: "u.email",
    version: "(fv.major || '.' || fv.minor || '.' || fv.patch)",
    updated: "upt.last_update",
    status: null,
};