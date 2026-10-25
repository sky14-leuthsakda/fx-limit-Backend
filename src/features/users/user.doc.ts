export const userDocs = {
    "/users": {
        post: {
            summary: "ສ້າງຜູ້ໃຊ້ງານໃໝ່ (Create User)",
            tags: ["Users"],
            security: [{ BearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                username: { type: "string", example: "john_doe" },
                                password: { type: "string", example: "secret123" },
                                firstNameEn: { type: "string", example: "John" },
                                lastNameEn: { type: "string", example: "Doe" },
                                firstNameLo: { type: "string", example: "ຈອນ" },
                                lastNameLo: { type: "string", example: "ໂດ" },
                                branchId: { type: "integer", example: 1 },
                                unitId: { type: "integer", example: 2 },
                            },
                            required: ["username", "password", "firstNameEn", "lastNameEn", "firstNameLo", "lastNameLo", "branchId"],
                        },
                    },
                },
            },
            responses: {
                "201": { description: "ສ້າງຜູ້ໃຊ້ສຳເລັດ" },
                "400": { description: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ" },
                "401": { description: "Unauthorized" },
                "409": { description: "Username ມີຢູ່ແລ້ວ" },
            },
        },
        get: {
            summary: "ດຶງລາຍຊື່ຜູ້ໃຊ້ງານທັງໝົດ (Get All Users)",
            tags: ["Users"],
            security: [{ BearerAuth: [] }],
            responses: {
                "200": { description: "ດຶງລາຍຊື່ສຳເລັດ" },
                "401": { description: "Unauthorized" },
            },
        },
    },
    "/users/paginated": {
        get: {
            summary: "ດຶງລາຍຊື່ຜູ້ໃຊ້ງານແບບແບ່ງໜ້າ (Get Users Paginated)",
            tags: ["Users"],
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: "page", in: "query", schema: { type: "integer", default: 1 } },
                { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
            ],
            responses: {
                "200": { description: "ດຶງລາຍການສຳເລັດ" },
            },
        },
    },
    "/users/deleted": {
        get: {
            summary: "ດຶງລາຍຊື່ຜູ້ໃຊ້ທີ່ຖືກລົບ / Trash Bin (Get Deleted Users)",
            tags: ["Users"],
            security: [{ BearerAuth: [] }],
            responses: {
                "200": { description: "ດຶງລາຍຊື່ຜູ້ໃຊ້ທີ່ຖືກລົບສຳເລັດ" },
                "401": { description: "Unauthorized" },
            },
        },
    },
    "/users/{id}": {
        get: {
            summary: "ດຶງຂໍ້ມູນຜູ້ໃຊ້ຕາມ ID (Get User By ID)",
            tags: ["Users"],
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "integer" } },
            ],
            responses: {
                "200": { description: "ສຳເລັດ" },
                "400": { description: "ຕ້ອງລະບຸ ID" },
                "404": { description: "ບໍ່ພົບຜູ້ໃຊ້" },
            },
        },
        put: {
            summary: "ແກ້ໄຂຂໍ້ມູນຜູ້ໃຊ້ (Update User)",
            tags: ["Users"],
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
                                firstNameEn: { type: "string", example: "Jonathan" },
                                lastNameEn: { type: "string", example: "Doe" },
                                firstNameLo: { type: "string", example: "ໂຢນາທານ" },
                                lastNameLo: { type: "string", example: "ໂດ" },
                                branchId: { type: "integer", example: 1 },
                                unitId: { type: "integer", example: 2 },
                                isActive: { type: "integer", example: 1 },
                            },
                        },
                    },
                },
            },
            responses: {
                "200": { description: "ແກ້ໄຂຜູ້ໃຊ້ສຳເລັດ" },
                "400": { description: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ" },
                "404": { description: "ບໍ່ພົບຜູ້ໃຊ້" },
            },
        },
    },
    "/users/{id}/roles": {
        get: {
            summary: "ດຶງຂໍ້ມູນ Role ຂອງ User (Get User Roles)",
            tags: ["Users"],
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "integer" } },
            ],
            responses: {
                "200": { description: "ສຳເລັດ" },
                "404": { description: "ບໍ່ພົບຜູ້ໃຊ້" },
            },
        },
        post: {
            summary: "ເພີ່ມ Role ໃຫ້ຜູ້ໃຊ້ (Assign Role To User)",
            tags: ["Users"],
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
                                roleId: { type: "integer", example: 1 },
                            },
                            required: ["roleId"],
                        },
                    },
                },
            },
            responses: {
                "201": { description: "ເພີ່ມ Role ສຳເລັດ" },
                "404": { description: "ບໍ່ພົບ User ຫຼື Role" },
                "409": { description: "User ມີ Role ນี้ແລ້ວ" },
            },
        },
    },
    "/users/{id}/roles/{roleId}": {
        delete: {
            summary: "ລົບ Role ຂອງຜູ້ໃຊ້ (Remove User Role)",
            tags: ["Users"],
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "integer" } },
                { name: "roleId", in: "path", required: true, schema: { type: "integer" } },
            ],
            responses: {
                "200": { description: "ລົບ Role ສຳເລັດ" },
                "404": { description: "ບໍ່ພົບข้อมูล" },
            },
        },
    },
    "/users/{id}/disable": {
        patch: {
            summary: "ປິດການໃຊ້ງານຜູ້ໃຊ້ / Soft Delete (Disable User)",
            tags: ["Users"],
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "integer" } },
            ],
            responses: {
                "200": { description: "ປິດການໃຊ້ງານສຳເລັດ" },
                "404": { description: "ບໍ່ພົບຜູ້ໃຊ້" },
            },
        },
    },
    "/users/{id}/enable": {
        patch: {
            summary: "ເປີດການໃຊ້ງານຜູ້ໃຊ້ / Restore (Enable User)",
            tags: ["Users"],
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "integer" } },
            ],
            responses: {
                "200": { description: "ເປີດການໃຊ້ງານສຳເລັດ" },
                "404": { description: "ບໍ່ພົບຜູ້ໃຊ້" },
            },
        },
    },
};