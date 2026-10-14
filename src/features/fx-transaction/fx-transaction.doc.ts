export const fxTransactionDocs = {
    "/fx-transactions": {
        post: {
            summary: "ບັນທຶກທຸລະກຳແລກປ່ຽນເງິນຕາ (Create FX Transaction)",
            tags: ["FX Transactions"],
            security: [{ BearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                customerId: { type: "integer", example: 1 },
                                currencyId: { type: "integer", example: 1 },
                                amount: { type: "number", example: 1000 },
                                type: { type: "string", example: "BUY" },
                            },
                            required: ["customerId", "currencyId", "amount", "type"],
                        },
                    },
                },
            },
            responses: {
                "201": { description: "ບັນທຶກທຸລະກຳສຳເລັດ" },
                "400": { description: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ" },
                "401": { description: "Unauthorized" },
            },
        },
        get: {
            summary: "ດຶງລາຍຊື່ທຸລະກຳທັງໝົດ (Get All FX Transactions)",
            tags: ["FX Transactions"],
            security: [{ BearerAuth: [] }],
            responses: {
                "200": { description: "ດຶງຂໍ້ມູນສຳເລັດ" },
                "401": { description: "Unauthorized" },
            },
        },
    },
    "/fx-transactions/paginated": {
        get: {
            summary: "ດຶງລາຍຊື່ທຸລະກຳແບບແບ່ງໜ້າ (Get FX Transactions Paginated)",
            tags: ["FX Transactions"],
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: "page", in: "query", schema: { type: "integer", default: 1 } },
                { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
            ],
            responses: {
                "200": { description: "ດຶງຂໍ້ມູນສຳເລັດ" },
            },
        },
    },
    "/fx-transactions/{id}": {
        get: {
            summary: "ດຶງຂໍ້ມູນທຸລະກຳຕາມ ID (Get FX Transaction By ID)",
            tags: ["FX Transactions"],
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "integer" } },
            ],
            responses: {
                "200": { description: "ສຳເລັດ" },
                "400": { description: "ຕ້ອງລະບຸ ID ທີ່ຖືກຕ້ອງ" },
            },
        },
        put: {
            summary: "ແກ້ໄຂທຸລະກຳ (Update FX Transaction)",
            tags: ["FX Transactions"],
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "integer" } },
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                amount: { type: "number", example: 1500 },
                            },
                        },
                    },
                },
            },
            responses: {
                "200": { description: "ແກ້ໄຂທຸລະກຳສຳເລັດ" },
                "400": { description: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ" },
            },
        },
    },
    "/fx-transactions/{id}/disable": {
        patch: {
            summary: "ລຶບ/ປິດການໃຊ້ງານທຸລະກຳ (Disable FX Transaction)",
            tags: ["FX Transactions"],
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "integer" } },
            ],
            responses: {
                "200": { description: "ລຶບທຸລະກຳສຳເລັດ" },
                "400": { description: "ຕ້ອງລະບຸ ID ທີ່ຖືກຕ້ອງ" },
            },
        },
    },
    "/fx-transactions/{id}/enable": {
        patch: {
            summary: "ກູ້ຄືນທຸລະກຳ (Restore FX Transaction)",
            tags: ["FX Transactions"],
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "integer" } },
            ],
            responses: {
                "200": { description: "ກູ້ຄືນທຸລະກຳສຳເລັດ" },
                "400": { description: "ຕ້ອງລະບຸ ID ທີ່ຖືກຕ້ອງ" },
            },
        },
    },
};