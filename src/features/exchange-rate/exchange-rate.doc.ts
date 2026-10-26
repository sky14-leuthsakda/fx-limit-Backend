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
                                rateDate: { type: "string", example: "2026-10-26" },
                                currencyId: { type: "integer", example: 1 },
                                rate: { type: "number", example: 21500.50 },
                            },
                            required: ["rateDate", "currencyId", "rate"],
                        },
                    },
                },
            },
            responses: {
                "201": { description: "ບັນທຶກອັດຕາແລກປ່ຽນສຳເລັດ" },
                "400": { description: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ" },
                "401": { description: "Unauthorized" },
                "409": { description: "ມີອັດຕາແລກປ່ຽນຂອງສະກຸນເງິນນີ້ສຳລັບວັນທີນີ້ຢູ່ແລ້ວ" },
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
    "/rates/deleted": {
        get: {
            summary: "ດຶງລາຍຊື່អັດຕາແລກປ່ຽນທີ່ຖືກລົບ / Trash Bin (Get Deleted Exchange Rates)",
            tags: ["Exchange Rates"],
            security: [{ BearerAuth: [] }],
            responses: {
                "200": { description: "ດຶງຂໍ້ມູນອັດຕາແລກປ່ຽນທີ່ຖືກລົບສຳເລັດ" },
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
                "404": { description: "ຍັງບໍ່ມີອັດຕາແລກປ່ຽນສຳລັບມື້ນີ້" },
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
                "404": { description: "ບໍ່ພົບ Rate" },
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
                                rateDate: { type: "string", example: "2026-10-26" },
                                currencyId: { type: "integer", example: 1 },
                                rate: { type: "number", example: 21600.00 },
                                isActive: { type: "integer", example: 1 },
                            },
                        },
                    },
                },
            },
            responses: {
                "200": { description: "ການອັບເດດອັດຕາແລກປ່ຽນສຳເລັດ" },
                "400": { description: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ" },
                "404": { description: "ບໍ່ພົບ Rate" },
                "409": { description: "ມີອັດຕາແລກປ່ຽນຂອງສະກຸນເງິນນີ້ສຳລັບວັນທີນີ້ຢູ່ແລ້ວ" },
            },
        },
    },
    "/rates/{id}/disable": {
        patch: {
            summary: "ປິດການໃຊ້ງານອັດຕາແລກປ່ຽນ / Soft Delete (Disable Exchange Rate)",
            tags: ["Exchange Rates"],
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "integer" } },
            ],
            responses: {
                "200": { description: "ການລຶບອັດຕາແລກປ່ຽນສຳເລັດ" },
                "400": { description: "ຕ້ອງລະບຸ ID" },
                "404": { description: "ບໍ່ພົບ Rate" },
            },
        },
    },
    "/rates/{id}/enable": {
        patch: {
            summary: "ເປີດການໃຊ້ງານອັດຕາແລກປ່ຽນ / Restore (Restore Exchange Rate)",
            tags: ["Exchange Rates"],
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "integer" } },
            ],
            responses: {
                "200": { description: "ການກູ້ຄືນອັດຕາແລກປ່ຽນສຳເລັດ" },
                "400": { description: "ຕ້ອງລະບຸ ID" },
                "404": { description: "ບໍ່ພົບ Rate" },
            },
        },
    },
};