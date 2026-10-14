export const auditDocs = {
    "/audit-logs/app-config-logs": {
        get: {
            summary: "ດຶງ Audit Logs ຂອງ App Config (Get App Config Logs)",
            tags: ["Audit Logs"],
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: "page", in: "query", schema: { type: "integer", default: 1 }, description: "ໜ້າທີ່ຕ້ອງການ" },
                { name: "limit", in: "query", schema: { type: "integer", default: 20 }, description: "ຈຳນວນຕໍ່ໜ້າ" },
            ],
            responses: {
                "200": { description: "ດຶງຂໍ້ມູນສຳເລັດ" },
                "400": { description: "ຂໍ້ມູນ Query ບໍ່ຖືກຕ້ອງ" },
                "401": { description: "Unauthorized" },
                "403": { description: "Forbidden (ຕ້ອງການສິດ REPORT_VIEW)" },
            },
        },
    },
    "/audit-logs/fx-daily-logs": {
        get: {
            summary: "ດຶງ Audit Logs ຂອງ FX Daily (Get FX Daily Logs)",
            tags: ["Audit Logs"],
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: "page", in: "query", schema: { type: "integer", default: 1 }, description: "ໜ້າທີ່ຕ້ອງການ" },
                { name: "limit", in: "query", schema: { type: "integer", default: 20 }, description: "ຈຳນວນຕໍ່ໜ້າ" },
            ],
            responses: {
                "200": { description: "ດຶງຂໍ້ມູນສຳເລັດ" },
                "400": { description: "ຂໍ້ມູນ Query ບໍ່ຖືກຕ້ອງ" },
                "401": { description: "Unauthorized" },
                "403": { description: "Forbidden (ຕ້ອງການສິດ REPORT_VIEW)" },
            },
        },
    },
};