export const authDocs = {
    "auth/login": {
        post: {
            summary: "ເຂົ້າສູ່ລະບົບ (Login)",
            tags: ["Authentication"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                username: { type: "string", example: "admin" },
                                password: { type: "string", example: "password123" }
                            },
                            required: ["username", "password"],
                        },
                    },
                },
            },
            responses: {
                "200": { description: "ເຂົ້າສູ່ລະບົບສຳເລັດ" },
                "400": { description: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ / zod Validation Error" },
            },
        },
    },
    "/auth/logout": {
        post: {
            summary: "ອອກຈາກລະບົບ (Logout)",
            tags: ["Authentication"],
            security: [{ BearerAuth: [] }],
            responses: {
                "200": { description: "ອອກຈາກລະບົບສຳເລັດ" },
                "401": { description: "Unauthorized - ຍັງບໍ່ໄດ້ເຂົ້າສູ່ລະບົບ" },
            },
        },
    },
    "/auth/change-password": {
        post: {
            summary: "ປ່ຽນລະຫັດຜ່ານ (Change Password)",
            tags: ["Authentication"],
            security: [{ BearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                oldPassword: { type: "string", example: "old123" },
                                newPassword: { type: "string", example: "new123" },
                            },
                            required: ["oldPassword", "newPassword"],
                        },
                    },
                },
            },
            responses: {
                "200": { description: "ປ່ຽນລະຫັດຜ່ານສຳເລັດ" },
                "400": { description: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ" },
                "401": { description: "Unauthorized" },
            },
        },
    },
    "/auth/reset-password/{userId}": {
        post: {
            summary: "ຣີເຊັດລະຫັດຜ່ານຜູ້ໃຊ້ (Reset Password by Admin)",
            tags: ["Authentication"],
            security: [{ BearerAuth: [] }],
            parameters: [
                {
                    name: "userId",
                    in: "path",
                    required: true,
                    schema: { type: "integer" },
                    description: "ID ຂອງ User ທີ່ຕ້ອງການຣີເຊັດ",
                },
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                newPassword: { type: "string", example: "reset123" },
                            },
                            required: ["newPassword"],
                        },
                    },
                },
            },
            responses: {
                "200": { description: "ຣີເຊັດລະຫັດຜ່ານສຳເລັດ" },
                "400": { description: "ຕ້ອງລະບຸ User ID ຫຼື ຂໍ້ມູນບໍ່ຖືກຕ້ອງ" },
                "403": { description: "Forbidden - ບໍ່ມີສິດ (USER_MANAGE)" },
            },
        },
    },
};

