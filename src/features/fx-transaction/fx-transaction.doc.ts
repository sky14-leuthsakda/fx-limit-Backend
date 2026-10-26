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
                                idTypeId: { type: "integer", example: 1 },
                                idCode: { type: "string", example: "B1234567" },
                                isForeigner: { type: "boolean", example: false },
                                firstNameEn: { type: "string", example: "John" },
                                lastNameEn: { type: "string", example: "Doe" },
                                firstNameLo: { type: "string", example: "ຈອນ" },
                                lastNameLo: { type: "string", example: "ໂດ" },
                                dateOfBirth: { type: "string", example: "1990-01-01" },
                                genderId: { type: "integer", example: 1 },
                                phoneNumber: { type: "string", example: "2022111222" },
                                address: { type: "string", example: "Vientiane" },
                                productId: { type: "integer", example: 1 },
                                currencyId: { type: "integer", example: 2 },
                                amountForeign: { type: "number", example: 1000.00 },
                                branchId: { type: "integer", example: 1 },
                                unitId: { type: "integer", example: 1 },
                            },
                            required: ["idTypeId", "idCode", "isForeigner", "productId", "currencyId", "amountForeign", "branchId"],
                        },
                    },
                },
            },
            responses: {
                "201": { description: "ບັນທຶກທຸລະກຳສຳເລັດ" },
                "400": { description: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ" },
                "401": { description: "Unauthorized" },
                "409": { description: "ລູກຄ້າມີເລກທີເອກະສານນີ້ແລ້ວ ຫຼື ທຸລະກຳເກີນວົງເງິນສູງສຸດຕໍ່ເດືອນ" },
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
    "/fx-transactions/deleted": {
        get: {
            summary: "ດຶງລາຍຊື່ທຸລະກຳທີ່ຖືກລົບ / Trash Bin (Get Deleted FX Transactions)",
            tags: ["FX Transactions"],
            security: [{ BearerAuth: [] }],
            responses: {
                "200": { description: "ດຶງຂໍ້ມູນທຸລະກຳທີ່ຖືກລົບສຳເລັດ" },
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
                "404": { description: "ບໍ່ພົບທຸລະກຳ" },
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
                                productId: { type: "integer", example: 1 },
                                currencyId: { type: "integer", example: 2 },
                                amountForeign: { type: "number", example: 1500.00 },
                                branchId: { type: "integer", example: 1 },
                                unitId: { type: "integer", example: 1 },
                                isActive: { type: "integer", example: 1 },
                            },
                        },
                    },
                },
            },
            responses: {
                "200": { description: "ແກ້ໄຂທຸລະກຳສຳເລັດ" },
                "400": { description: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ" },
                "404": { description: "ບໍ່ພົບທຸລະກຳ" },
                "409": { description: "ທຸລະກຳເກີນວົງເງິນສູງສຸດຕໍ່ເດືອນ" },
            },
        },
    },
    "/fx-transactions/{id}/disable": {
        patch: {
            summary: "ລຶບ/ປິດການໃຊ້ງານທຸລະກຳ / Soft Delete (Disable FX Transaction)",
            tags: ["FX Transactions"],
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "integer" } },
            ],
            responses: {
                "200": { description: "ລຶບທຸລະກຳສຳເລັດ" },
                "400": { description: "ຕ້ອງລະບຸ ID ທີ່ຖືກຕ້ອງ" },
                "404": { description: "ບໍ່ພົບທຸລະກຳ" },
            },
        },
    },
    "/fx-transactions/{id}/enable": {
        patch: {
            summary: "ກູ້ຄືນທຸລະກຳ / Restore (Restore FX Transaction)",
            tags: ["FX Transactions"],
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "integer" } },
            ],
            responses: {
                "200": { description: "ກູ້ຄືນທຸລະກຳສຳເລັດ" },
                "400": { description: "ຕ້ອງລະບຸ ID ທີ່ຖືກຕ້ອງ" },
                "404": { description: "ບໍ່ພົບທຸລະກຳ" },
            },
        },
    },
};