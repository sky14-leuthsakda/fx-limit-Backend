export const exchangeRateDocs = {
    "/rates": {
        post: {
            summary: "ສ້າງອັດຕາແລກປ່ຽນໃໝ່ (Create Exchange Rate)",
            tags: ["Exchange Rates"],
            security: [{ BearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                currencyId: { type: "integer", example: 1 },
                                buyRate: { type: "number", example: 21500 },
                                sellRate: { type: "number", example: 21700 },
                            },
                            required: ["currencyId", "buyRate", "sellRate"],
                        },
                    },
                },
            },
            responses: {
                "201": { description: "ບັນທຶກອັດຕາແລກປ່ຽນສຳເລັດ" },
                "400": { description: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ" },
                "401": { description: "Unauthorized" },
            },
        },
        get: {
            summary: "ດຶງລາຍຊື່អັດຕາແລກປ່ຽນທັງໝົດ (Get All Exchange Rates)",
            tags: ["Exchange Rates"],
            security: [{ BearerAuth: [] }],
            responses: {
                "200": { description: "ດຶງຂໍ້ມູນສຳເລັດ" },
                "401": { description: "Unauthorized" },
            },
        },
    },
    "/rates/paginated": {
        get: {
            summary: "ດຶງອັດຕາແລກປ່ຽນແບບແບ່ງໜ້າ (Get Exchange Rates Paginated)",
            tags: ["Exchange Rates"],
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
    "/rates/today": {
        get: {
            summary: "ດຶງອັດຕາແລກປ່ຽນປະຈຳວັນທັງໝົດ (Get Today's All Rates)",
            tags: ["Exchange Rates"],
            security: [{ BearerAuth: [] }],
            responses: {
                "200": { description: "ດຶງຂໍ້ມູນສຳເລັດ" },
            },
        },
    },
    "/rates/today/{currencyId}": {
        get: {
            summary: "ດຶງອັດຕາແລກປ່ຽນປະຈຳວັນຕາມ Currency ID (Get Today Rate By Currency ID)",
            tags: ["Exchange Rates"],
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: "currencyId", in: "path", required: true, schema: { type: "integer" } },
            ],
            responses: {
                "200": { description: "ສຳເລັດ" },
                "400": { description: "ຕ້ອງລະບຸ Currency ID" },
            },
        },
    },
    "/rates/history/{currencyId}": {
        get: {
            summary: "ດຶງປະຫວັດອັດຕາແລກປ່ຽນຕາມ Currency ID (Get Rate History)",
            tags: ["Exchange Rates"],
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: "currencyId", in: "path", required: true, schema: { type: "integer" } },
                { name: "limit", in: "query", schema: { type: "integer", default: 30 } },
            ],
            responses: {
                "200": { description: "ສຳເລັດ" },
                "400": { description: "ຕ້ອງລະບຸ Currency ID" },
            },
        },
    },
    "/rates/{id}": {
        get: {
            summary: "ດຶງຂໍ້ມູນອັດຕາແລກປ່ຽນຕາມ ID (Get Rate By ID)",
            tags: ["Exchange Rates"],
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "integer" } },
            ],
            responses: {
                "200": { description: "ສຳເລັດ" },
                "400": { description: "ຕ້ອງລະບຸ ID" },
            },
        },
        put: {
            summary: "ແກ້ໄຂອັດຕາແລກປ່ຽນ (Update Exchange Rate)",
            tags: ["Exchange Rates"],
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
                                buyRate: { type: "number", example: 21600 },
                                sellRate: { type: "number", example: 21800 },
                            },
                        },
                    },
                },
            },
            responses: {
                "200": { description: "ການອັບເດດອັດຕາແລກປ່ຽນສຳເລັດ" },
                "400": { description: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ" },
            },
        },
    },
    "/rates/{id}/disable": {
        patch: {
            summary: "ປິດການໃຊ້ງານອັດຕາແລກປ່ຽນ (Disable Exchange Rate)",
            tags: ["Exchange Rates"],
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "integer" } },
            ],
            responses: {
                "200": { description: "ການລຶບອັດຕາແລກປ່ຽນສຳເລັດ" },
                "400": { description: "ຕ້ອງລະບຸ ID" },
            },
        },
    },
    "/rates/{id}/enable": {
        patch: {
            summary: "ເປີດການໃຊ້ງານອັດຕາແລກປ່ຽນ (Restore Exchange Rate)",
            tags: ["Exchange Rates"],
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "integer" } },
            ],
            responses: {
                "200": { description: "ການກູ້ຄືນອັດຕາແລກປ່ຽນສຳເລັດ" },
                "400": { description: "ຕ້ອງລະບຸ ID" },
            },
        },
    },
};