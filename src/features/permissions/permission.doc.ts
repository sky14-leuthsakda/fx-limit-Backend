export const permissionDocs = {
    "/permissions": {
        post: {
            summary: "ສ້າງ Permission ໃໝ່ (Create Permission)",
            tags: ["Permissions"],
            security: [{ BearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                name: { type: "string", example: "USER_MANAGE" },
                                description: { type: "string", example: "ສິດຈັດການຜູ້ໃຊ້ງານ" },
                            },
                            required: ["name"],
                        },
                    },
                },
            },
            responses: {
                "201": { description: "ສ້າງສິດການໃຊ້ສຳເລັດ" },
                "400": { description: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ" },
                "401": { description: "Unauthorized" },
            },
        },
        get: {
            summary: "ດຶງລາຍຊື່ Permissions ທັງໝົດ (Get All Permissions)",
            tags: ["Permissions"],
            security: [{ BearerAuth: [] }],
            responses: {
                "200": { description: "ດຶງຂໍ້ມູນສິດການໃຊ້ງານສຳເລັດ" },
                "401": { description: "Unauthorized" },
            },
        },
    },
    "/permissions/{id}": {
        get: {
            summary: "ດຶງຂໍ້ມູນ Permission ຕາມ ID (Get Permission By ID)",
            tags: ["Permissions"],
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
            summary: "ແກ້ໄຂຂໍ້ມູນ Permission (Update Permission)",
            tags: ["Permissions"],
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
                                name: { type: "string", example: "USER_MANAGE" },
                                description: { type: "string", example: "ອັບເດດລາຍລະອຽດສິດ" },
                            },
                        },
                    },
                },
            },
            responses: {
                "200": { description: "ແກ້ໄຂສິດການໃຊ້ສຳເລັດ" },
                "400": { description: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ" },
            },
        },
    },
    "/permissions/{id}/disable": {
        patch: {
            summary: "ປິດການໃຊ້ງານ Permission (Disable Permission)",
            tags: ["Permissions"],
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "integer" } },
            ],
            responses: {
                "200": { description: "ປິດການໃຊ້ງານ Permission ສຳເລັດ" },
                "400": { description: "ຕ້ອງລະບຸ ID" },
            },
        },
    },
    "/permissions/{id}/enable": {
        patch: {
            summary: "ເປີດການໃຊ້ງານ Permission (Restore Permission)",
            tags: ["Permissions"],
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "integer" } },
            ],
            responses: {
                "200": { description: "ເປີດການໃຊ້ Permission ສຳເລັດ" },
                "400": { description: "ຕ້ອງລະບຸ ID" },
            },
        },
    },
};