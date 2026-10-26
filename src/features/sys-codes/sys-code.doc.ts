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
                                category: { type: "string", example: "CURRENCY" },
                                code: { type: "string", example: "USD" },
                                nameEn: { type: "string", example: "US Dollar" },
                                nameLo: { type: "string", example: "ໂດລາສະຫະລັດ" },
                                codeOrder: { type: "integer", example: 1 },
                            },
                            required: ["category", "code", "nameEn", "nameLo"],
                        },
                    },
                },
            },
            responses: {
                "201": { description: "ສ້າງ Sys Code ສຳເລັດ" },
                "400": { description: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ" },
                "401": { description: "Unauthorized" },
                "409": { description: "Code ນີ້ໃນ Category ນີ້ມີຢູ່ແລ້ວ" },
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
    "/sys-codes/deleted": {
        get: {
            summary: "ດຶງລາຍຊື່ Sys Code ທີ່ຖືກລົບ / Trash Bin (Get Deleted Sys Codes)",
            tags: ["System Codes"],
            security: [{ BearerAuth: [] }],
            responses: {
                "200": { description: "ດຶງຂໍ້ມູນ Sys Code ທີ່ຖືກລົບສຳເລັດ" },
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
                "404": { description: "ບໍ່ພົບ Sys Code" },
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
                                category: { type: "string", example: "CURRENCY" },
                                code: { type: "string", example: "USD" },
                                nameEn: { type: "string", example: "US Dollar Updated" },
                                nameLo: { type: "string", example: "ໂດລາສະຫະລັດ (ອັບເດດ)" },
                                codeOrder: { type: "integer", example: 1 },
                                isActive: { type: "integer", example: 1 },
                            },
                        },
                    },
                },
            },
            responses: {
                "200": { description: "ແກ້ໄຂ Sys Code ສຳເລັດ" },
                "400": { description: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ" },
                "404": { description: "ບໍ່ພົບ Sys Code" },
                "409": { description: "Code ນີ້ໃນ Category ນີ້ມີຢູ່ແລ້ວ" },
            },
        },
    },
    "/sys-codes/{id}/disable": {
        patch: {
            summary: "ປິດການໃຊ້ງານ Sys Code / Soft Delete (Disable Sys Code)",
            tags: ["System Codes"],
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "integer" } },
            ],
            responses: {
                "200": { description: "ປິດການໃຊ້ງານ Sys Code ສຳເລັດ" },
                "400": { description: "ຕ້ອງລະບຸ ID" },
                "404": { description: "ບໍ່ພົບ Sys Code" },
            },
        },
    },
    "/sys-codes/{id}/enable": {
        patch: {
            summary: "ເປີດການໃຊ້ງານ Sys Code / Restore Sys Code (Enable Sys Code)",
            tags: ["System Codes"],
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "integer" } },
            ],
            responses: {
                "200": { description: "ເປີດການໃຊ້ງານ Sys Code ສຳເລັດ" },
                "400": { description: "ຕ້ອງລະບຸ ID" },
                "404": { description: "ບໍ່ພົບ Sys Code" },
            },
        },
    },
};