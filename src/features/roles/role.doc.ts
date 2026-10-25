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
                                roleCode: { type: "string", example: "ADMIN" },
                                roleNameEn: { type: "string", example: "Administrator" },
                                roleNameLo: { type: "string", example: "ຜູ້ດູແລລະບົບ" },
                                description: { type: "string", example: "ຜູ້ດູແລລະບົບສູງສຸດ" },
                            },
                            required: ["roleCode", "roleNameEn", "roleNameLo"],
                        },
                    },
                },
            },
            responses: {
                "201": { description: "ສ້າງ Role ສຳເລັດ" },
                "400": { description: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ" },
                "401": { description: "Unauthorized" },
                "409": { description: "Role Code ມີຢູ່ແລ້ວ" },
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
    "/roles/deleted": {
        get: {
            summary: "ດຶງລາຍຊື່ Role ທີ່ຖືກລົບ / Trash Bin (Get Deleted Roles)",
            tags: ["Roles"],
            security: [{ BearerAuth: [] }],
            responses: {
                "200": { description: "ດຶງລາຍຊື່ Role ທີ່ຖືກລົບສຳເລັດ" },
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
                "404": { description: "ບໍ່ພົບ Role" },
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
                                roleCode: { type: "string", example: "SUPER_ADMIN" },
                                roleNameEn: { type: "string", example: "Super Administrator" },
                                roleNameLo: { type: "string", example: "ຜູ້ດູແລລະບົບສູງສຸດ" },
                                description: { type: "string", example: "ຜູ້ດູແລລະບົບສູງສຸດຂອງລະບົບ" },
                                isActive: { type: "integer", example: 1 },
                            },
                        },
                    },
                },
            },
            responses: {
                "200": { description: "ແກ້ໄຂ Role ສຳເລັດ" },
                "400": { description: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ" },
                "404": { description: "ບໍ່ພົບ Role" },
                "409": { description: "Role Code ມີຢູ່ແລ້ວ" },
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
                "404": { description: "ບໍ່ພົບ Role" },
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
                "404": { description: "ບໍ່ພົບ Role ຫຼື Permission" },
                "409": { description: "Role ນี้ມີ Permission ນີ້ແລ້ວ" },
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
                "404": { description: "ບໍ່ພົບຂໍ້ມູນ" },
            },
        },
    },
    "/roles/{id}/disable": {
        patch: {
            summary: "ປິດການໃຊ້ງານ Role / Soft Delete (Disable Role)",
            tags: ["Roles"],
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "integer" } },
            ],
            responses: {
                "200": { description: "ປິດການໃຊ້ງານສຳເລັດ" },
                "400": { description: "ຕ້ອງລະບຸ ID" },
                "404": { description: "ບໍ່ພົບ Role" },
            },
        },
    },
    "/roles/{id}/enable": {
        patch: {
            summary: "ເປີດການໃຊ້ງານ Role / Restore (Enable Role)",
            tags: ["Roles"],
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "integer" } },
            ],
            responses: {
                "200": { description: "ເປີດໃຊ້ Role ສຳເລັດ" },
                "400": { description: "ຕ້ອງລະບຸ ID" },
                "404": { description: "ບໍ່ພົບ Role" },
            },
        },
    },
};