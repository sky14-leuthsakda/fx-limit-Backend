export const sysCodeDocs = {
    "/sys-codes": {
        post: {
            summary: "ສ້າງ Sys Code ໃໝ່ (Create Sys Code)",
            tags: ["System Codes"],
            security: [{ BearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                code: { type: "string", example: "USD" },
                                name: { type: "string", example: "US Dollar" },
                                category: { type: "string", example: "CURRENCY" },
                            },
                            required: ["code", "name", "category"],
                        },
                    },
                },
            },
            responses: {
                "201": { description: "ສ້າງ Sys Code ສຳເລັດ" },
                "400": { description: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ" },
                "401": { description: "Unauthorized" },
            },
        },
        get: {
            summary: "ດຶງລາຍຊື່ Sys Codes ທັງໝົດ ຫຼື ຕາມ Category (Get Sys Codes)",
            tags: ["System Codes"],
            security: [{ BearerAuth: [] }],
            parameters: [
                {
                    name: "category",
                    in: "query",
                    required: false,
                    schema: { type: "string", example: "CURRENCY" },
                    description: "ກອງຕາມໝວດໝູ່ (Category)",
                },
            ],
            responses: {
                "200": { description: "ດຶງຂໍ້ມູນສຳເລັດ" },
                "401": { description: "Unauthorized" },
            },
        },
    },
    "/sys-codes/{id}": {
        get: {
            summary: "ດຶງຂໍ້ມູນ Sys Code ຕາມ ID (Get Sys Code By ID)",
            tags: ["System Codes"],
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
            summary: "ແກ້ໄຂຂໍ້ມູນ Sys Code (Update Sys Code)",
            tags: ["System Codes"],
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
                                name: { type: "string", example: "US Dollar Updated" },
                            },
                        },
                    },
                },
            },
            responses: {
                "200": { description: "ແກ້ໄຂ Sys Code ສຳເລັດ" },
                "400": { description: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ" },
            },
        },
    },
    "/sys-codes/{id}/disable": {
        patch: {
            summary: "ປິດການໃຊ້ງານ Sys Code (Disable Sys Code)",
            tags: ["System Codes"],
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "integer" } },
            ],
            responses: {
                "200": { description: "ປິດການໃຊ້ງານ Sys Code ສຳເລັດ" },
                "400": { description: "ຕ້ອງລະບຸ ID" },
            },
        },
    },
    "/sys-codes/{id}/enable": {
        patch: {
            summary: "ເປີດການໃຊ້ງານ Sys Code (Restore Sys Code)",
            tags: ["System Codes"],
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "integer" } },
            ],
            responses: {
                "200": { description: "ເປີດການໃຊ້ງານ Sys Code ສຳເລັດ" },
                "400": { description: "ຕ້ອງລະບຸ ID" },
            },
        },
    },
};