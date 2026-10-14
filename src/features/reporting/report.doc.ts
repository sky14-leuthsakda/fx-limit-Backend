export const reportDocs = {
    "/reports/transaction": {
        get: {
            summary: "ດຶງລາຍງານລາຍລະອຽດທຸລະກຳ (Transaction Detail Report)",
            tags: ["Reports"],
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: "startDate", in: "query", schema: { type: "string", format: "date" }, description: "ວັນທີເລີ່ມຕົ້ນ (YYYY-MM-DD)" },
                { name: "endDate", in: "query", schema: { type: "string", format: "date" }, description: "ວັນທີສິ້ນສຸດ (YYYY-MM-DD)" },
                { name: "page", in: "query", schema: { type: "integer", default: 1 } },
                { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
            ],
            responses: {
                "200": { description: "ດຶງຂໍ້ມູນສຳເລັດ" },
                "400": { description: "ຂໍ້ມູນ Query ບໍ່ຖືກຕ້ອງ" },
                "401": { description: "Unauthorized" },
                "403": { description: "Forbidden (ຕ້ອງການສິດ REPORT_VIEW)" },
            },
        },
    },
    "/reports/summary": {
        get: {
            summary: "ດຶງລາຍງານສະຫຼຸບຍອດລວມ (Summary Report)",
            tags: ["Reports"],
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: "startDate", in: "query", schema: { type: "string", format: "date" }, description: "ວັນທີເລີ່ມຕົ້ນ (YYYY-MM-DD)" },
                { name: "endDate", in: "query", schema: { type: "string", format: "date" }, description: "ວັນທີສິ້ນສຸດ (YYYY-MM-DD)" },
            ],
            responses: {
                "200": { description: "ດຶງຂໍ້ມູນສຳເລັດ" },
                "400": { description: "ຂໍ້ມູນ Query ບໍ່ຖືກຕ້ອງ" },
                "401": { description: "Unauthorized" },
                "403": { description: "Forbidden" },
            },
        },
    },
    "/reports/over-limit": {
        get: {
            summary: "ດຶງລາຍງານທຸລະກຳທີ່ເກີນວົງເງິນກຳນົດ (Over-limit Report)",
            tags: ["Reports"],
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: "startDate", in: "query", schema: { type: "string", format: "date" }, description: "ວັນທີເລີ່ມຕົ້ນ (YYYY-MM-DD)" },
                { name: "endDate", in: "query", schema: { type: "string", format: "date" }, description: "ວັນທີສິ້ນສຸດ (YYYY-MM-DD)" },
                { name: "page", in: "query", schema: { type: "integer", default: 1 } },
                { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
            ],
            responses: {
                "200": { description: "ດຶງຂໍ້ມູນສຳເລັດ" },
                "400": { description: "ຂໍ້ມູນ Query ບໍ່ຖືກຕ້ອງ" },
                "401": { description: "Unauthorized" },
                "403": { description: "Forbidden" },
            },
        },
    },
};