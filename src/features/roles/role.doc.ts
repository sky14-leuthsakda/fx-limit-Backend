export const roleDocs = {
    "/roles": {
        post: {
            summary: "ສ້າງ Role ໃໝ່ (Create Role)",
            tags: ["Roles"],
            security: [{ BearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                name: { type: "string", example: "ADMIN" },
                                description: { type: "string", example: "ຜູ້ດູແລລະບົບ" },
                            },
                            required: ["name"],
                        },
                    },
                },
            },
            responses: {
                "201": { description: "ສ້າງ Role ສຳເລັດ" },
                "400": { description: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ" },
                "401": { description: "Unauthorized" },
            },
        },
        get: {
            summary: "ດຶງລາຍຊື່ Roles ທັງໝົດ (Get All Roles)",
            tags: ["Roles"],
            security: [{ BearerAuth: [] }],
            responses: {
                "200": { description: "ດຶງລາຍຊື່ສຳເລັດ" },
                "401": { description: "Unauthorized" },
            },
        },
    },
    "/roles/{id}": {
        get: {
            summary: "ດຶງຂໍ້ມູນ Role ຕາມ ID (Get Role By ID)",
            tags: ["Roles"],
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
            summary: "ແກ້ໄຂຂໍ້ມູນ Role (Update Role)",
            tags: ["Roles"],
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
                                name: { type: "string", example: "SUPER_ADMIN" },
                                description: { type: "string", example: "ຜູ້ດູແລລະບົບສູງສຸດ" },
                            },
                        },
                    },
                },
            },
            responses: {
                "200": { description: "ແກ້ໄຂ Role ສຳເລັດ" },
                "400": { description: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ" },
            },
        },
    },
    "/roles/{id}/permissions": {
        get: {
            summary: "ດຶງຂໍ້ມູນ Permission ຂອງ Role (Get Role Permissions)",
            tags: ["Roles"],
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "integer" } },
            ],
            responses: {
                "200": { description: "ດຶງຂໍ້ມູນ Permission ສຳເລັດ" },
                "400": { description: "ຕ້ອງລະບຸ ID" },
            },
        },
        post: {
            summary: "ເພີ່ມ Permission ໃຫ້ Role (Assign Permission To Role)",
            tags: ["Roles"],
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
                                permissionId: { type: "integer", example: 1 },
                            },
                            required: ["permissionId"],
                        },
                    },
                },
            },
            responses: {
                "201": { description: "ເພີ່ມ Permission ສຳເລັດ" },
                "400": { description: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ" },
            },
        },
    },
    "/roles/{id}/permissions/{permissionId}": {
        delete: {
            summary: "ຖອນ Permission ຈາກ Role (Revoke Permission)",
            tags: ["Roles"],
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "integer" } },
                { name: "permissionId", in: "path", required: true, schema: { type: "integer" } },
            ],
            responses: {
                "200": { description: "ຖອນ Permission ສຳເລັດ" },
                "400": { description: "ຕ້ອງລະບຸ ID" },
            },
        },
    },
    "/roles/{id}/disable": {
        patch: {
            summary: "ປິດການໃຊ້ງານ Role (Disable Role)",
            tags: ["Roles"],
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "integer" } },
            ],
            responses: {
                "200": { description: "ປິດການໃຊ້ງານສຳເລັດ" },
                "400": { description: "ຕ້ອງລະບຸ ID" },
            },
        },
    },
    "/roles/{id}/enable": {
        patch: {
            summary: "ເປີດການໃຊ້ງານ Role (Enable Role)",
            tags: ["Roles"],
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "integer" } },
            ],
            responses: {
                "200": { description: "ເປີດໃຊ້ Role ສຳເລັດ" },
                "400": { description: "ຕ້ອງລະບຸ ID" },
            },
        },
    },
};