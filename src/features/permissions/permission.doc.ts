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
                                permissionCode: { type: "string", example: "USER_CREATE" },
                                permissionNameEn: { type: "string", example: "Create User" },
                                permissionNameLo: { type: "string", example: "ສ້າງຜູ້ໃຊ້ງານ" },
                                description: { type: "string", example: "ສິດໃນການສ້າງຜູ້ໃຊ້ງານໃໝ່" },
                            },
                            required: ["permissionCode", "permissionNameEn", "permissionNameLo"],
                        },
                    },
                },
            },
            responses: {
                "201": { description: "ສ້າງສິດການໃຊ້ສຳເລັດ" },
                "400": { description: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ" },
                "401": { description: "Unauthorized" },
                "409": { description: "Permission Code ມີຢູ່ແລ້ວ" },
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
    "/permissions/deleted": {
        get: {
            summary: "ດຶງລາຍຊື່ Permission ທີ່ຖືກລົບ / Trash Bin (Get Deleted Permissions)",
            tags: ["Permissions"],
            security: [{ BearerAuth: [] }],
            responses: {
                "200": { description: "ດຶງຂໍ້ມູນສິດການໃຊ້ງານທີ່ຖືກລົບສຳເລັດ" },
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
                "200": { description: "ດຶງຂໍ້ມູນສິດການໃຊ້ງານສຳເລັດ" },
                "400": { description: "ຕ້ອງລະບຸ ID" },
                "404": { description: "ບໍ່ພົບ Permission" },
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
                                permissionCode: { type: "string", example: "USER_MANAGE" },
                                permissionNameEn: { type: "string", example: "Manage Users" },
                                permissionNameLo: { type: "string", example: "ຈັດການຜູ້ໃຊ້ງານ" },
                                description: { type: "string", example: "ສິດໃນการຈັດການຜູ້ໃຊ້ງານທັງໝົດ" },
                                isActive: { type: "integer", example: 1 },
                            },
                        },
                    },
                },
            },
            responses: {
                "200": { description: "ແກ້ໄຂສິດການໃຊ້ງານສຳເລັດ" },
                "400": { description: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ" },
                "404": { description: "ບໍ່ພົບ Permission" },
                "409": { description: "Permission Code ມີຢູ່ແລ້ວ" },
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
                "404": { description: "ບໍ່ພົບ Permission" },
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
                "404": { description: "ບໍ່ພົບ Permission" },
            },
        },
    },
};