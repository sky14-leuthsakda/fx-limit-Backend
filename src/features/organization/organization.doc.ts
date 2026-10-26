export const organizationDocs = {
    // ==================== Branches ====================
    "/branches": {
        post: {
            summary: "ສ້າງສາຂາໃໝ່ (Create Branch)",
            tags: ["Organization - Branches"],
            security: [{ BearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                branchCode: { type: "string", example: "VTE-001" },
                                branchNameEn: { type: "string", example: "Vientiane Branch" },
                                branchNameLo: { type: "string", example: "ສາຂາ ວຽງຈັນ" },
                            },
                            required: ["branchCode", "branchNameEn", "branchNameLo"],
                        },
                    },
                },
            },
            responses: {
                "201": { description: "ສ້າງສາຂາສຳເລັດ" },
                "400": { description: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ" },
                "401": { description: "Unauthorized" },
                "409": { description: "ລະຫັດສາຂານີ້ມີຢູ່ແລ້ວ" },
            },
        },
        get: {
            summary: "ດຶງລາຍຊື່ສາຂາທັງໝົດ (Get All Branches)",
            tags: ["Organization - Branches"],
            security: [{ BearerAuth: [] }],
            responses: {
                "200": { description: "ດຶງຂໍ້ມູນສຳເລັດ" },
                "401": { description: "Unauthorized" },
            },
        },
    },
    "/branches/deleted": {
        get: {
            summary: "ດຶງລາຍຊື່ສາຂາທີ່ຖືກລົບ / Trash Bin (Get Deleted Branches)",
            tags: ["Organization - Branches"],
            security: [{ BearerAuth: [] }],
            responses: {
                "200": { description: "ດຶງຂໍ້ມູນສາຂາທີ່ຖືກລົບສຳເລັດ" },
                "401": { description: "Unauthorized" },
            },
        },
    },
    "/branches/paginated": {
        get: {
            summary: "ດຶງລາຍຊື່ສາຂາແບບແບ່ງໜ້າ (Get Branches Paginated)",
            tags: ["Organization - Branches"],
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
    "/branches/{id}": {
        get: {
            summary: "ດຶງຂໍ້ມູນສາຂາຕາມ ID (Get Branch By ID)",
            tags: ["Organization - Branches"],
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "integer" } },
            ],
            responses: {
                "200": { description: "ສຳເລັດ" },
                "400": { description: "ຕ້ອງລະບຸ ID" },
                "404": { description: "ບໍ່ພົບສາຂາ" },
            },
        },
        put: {
            summary: "ແກ້ໄຂຂໍ້ມູນສາຂາ (Update Branch)",
            tags: ["Organization - Branches"],
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
                                branchCode: { type: "string", example: "LPQ-001" },
                                branchNameEn: { type: "string", example: "Luang Prabang Branch" },
                                branchNameLo: { type: "string", example: "ສາຂາ ຫຼວງພະບາງ" },
                                isActive: { type: "integer", example: 1 },
                            },
                        },
                    },
                },
            },
            responses: {
                "200": { description: "ແກ້ໄຂສາຂາສຳເລັດ" },
                "400": { description: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ" },
                "404": { description: "ບໍ່ພົບສາຂາ" },
                "409": { description: "Branch Code ນີ້ມີຢູ່ແລ້ວ" },
            },
        },
    },
    "/branches/{id}/disable": {
        patch: {
            summary: "ປິດການໃຊ້ງານສາຂາ / Soft Delete (Disable Branch)",
            tags: ["Organization - Branches"],
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "integer" } },
            ],
            responses: {
                "200": { description: "ປິດການໃຊ້ງານສາຂາສຳເລັດ" },
                "400": { description: "ຍັງມີ Unit ຢູ່ພາຍໃຕ້" },
                "404": { description: "ບໍ່ພົບສາຂາ" },
            },
        },
    },
    "/branches/{id}/enable": {
        patch: {
            summary: "ເປີດການໃຊ້ງານສາຂາ (Restore Branch)",
            tags: ["Organization - Branches"],
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "integer" } },
            ],
            responses: {
                "200": { description: "ເປີດການໃຊ້ງານສາຂາສຳເລັດ" },
                "400": { description: "ຕ້ອງລະບຸ ID" },
                "404": { description: "ບໍ່ພົບສາຂາ" },
                
            },
        },
    },
    "/branches/{branchId}/units": {
        get: {
            summary: "ດຶງລາຍຊື່ໜ່ວຍບໍລິການຕາມ Branch ID (Get Units By Branch)",
            tags: ["Organization - Units"],
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: "branchId", in: "path", required: true, schema: { type: "integer" } },
            ],
            responses: {
                "200": { description: "ສຳເລັດ" },
                "400": { description: "ຕ້ອງລະບຸ Branch ID" },
            },
        },
    },

    // ==================== Units ====================
    "/units": {
        post: {
            summary: "ສ້າງໜ່ວຍບໍລິການໃໝ່ (Create Unit)",
            tags: ["Organization - Units"],
            security: [{ BearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                branchId: { type: "integer", example: 1 },
                                unitCode: { type: "string", example: "UNIT-01" },
                                unitNameEn: { type: "string", example: "Central Market Unit" },
                                unitNameLo: { type: "string", example: "ໜ່ວຍບໍລິການ ຕະຫຼາດເຊົ້າ" },
                            },
                            required: ["branchId", "unitCode", "unitNameEn", "unitNameLo"],
                        },
                    },
                },
            },
            responses: {
                "201": { description: "ສ້າງໜ່ວຍບໍລິການສຳເລັດ" },
                "400": { description: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ" },
                "401": { description: "Unauthorized" },
                "409": { description: "Unit Code ນີ້ມີຢູ່ແລ້ວໃນ Branch ນี้" },
            },
        },
        get: {
            summary: "ດຶງລາຍຊື່ໜ່ວຍບໍລິການທັງໝົດ (Get All Units)",
            tags: ["Organization - Units"],
            security: [{ BearerAuth: [] }],
            responses: {
                "200": { description: "ດຶງຂໍ້ມູນສຳເລັດ" },
                "401": { description: "Unauthorized" },
            },
        },
    },
    "/units/deleted": {
        get: {
            summary: "ດຶງລາຍຊື່ໜ່ວຍບໍລິການທີ່ຖືກລົບ / Trash Bin (Get Deleted Units)",
            tags: ["Organization - Units"],
            security: [{ BearerAuth: [] }],
            responses: {
                "200": { description: "ດຶງຂໍ້ມູນໜ່ວຍບໍລິການທີ່ຖືກລົບສຳເລັດ" },
                "401": { description: "Unauthorized" },
            },
        },
    },
    "/units/paginated": {
        get: {
            summary: "ດຶງລາຍຊື່ໜ່ວຍບໍລິການແບບແບ່ງໜ້າ (Get Units Paginated)",
            tags: ["Organization - Units"],
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
    "/units/{id}": {
        get: {
            summary: "ດຶງຂໍ້ມູນໜ່ວຍບໍລິການຕາມ ID (Get Unit By ID)",
            tags: ["Organization - Units"],
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "integer" } },
            ],
            responses: {
                "200": { description: "ສຳເລັດ" },
                "400": { description: "ຕ້ອງລະບຸ ID" },
                "404": { description: "ບໍ່ພົບ Unit" },
            },
        },
        put: {
            summary: "ແກ້ໄຂຂໍ້ມູນໜ່ວຍບໍລິການ (Update Unit)",
            tags: ["Organization - Units"],
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
                                branchId: { type: "integer", example: 1 },
                                unitCode: { type: "string", example: "UNIT-02" },
                                unitNameEn: { type: "string", example: "Updated Unit" },
                                unitNameLo: { type: "string", example: "ໜ່ວຍບໍລິການ ອັບເດດ" },
                                isActive: { type: "integer", example: 1 },
                            },
                        },
                    },
                },
            },
            responses: {
                "200": { description: "ແກ້ໄຂໜ່ວຍບໍລິການສຳເລັດ" },
                "400": { description: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ" },
                "404": { description: "ບໍ່ພົບ Unit" },
                "409": { description: "Unit Code ນີ້ມີຢູ່ແລ້ວໃນສາຂານີ້" },
            },
        },
    },
    "/units/{id}/disable": {
        patch: {
            summary: "ປິດການໃຊ້ງານໜ່ວຍບໍລິການ (Disable Unit)",
            tags: ["Organization - Units"],
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "integer" } },
            ],
            responses: {
                "200": { description: "ປິດການໃຊ້ງານໜ່ວຍບໍລິການສຳເລັດ" },
                "400": { description: "ຕ້ອງລະບຸ ID" },
                "404": { description: "ບໍ່ພົບ Unit" },
            },
        },
    },
    "/units/{id}/enable": {
        patch: {
            summary: "ເປີດການໃຊ້ງານໜ່ວຍບໍລິການ (Restore Unit)",
            tags: ["Organization - Units"],
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "integer" } },
            ],
            responses: {
                "200": { description: "ເປີດການໃຊ້ງານໜ່ວຍບໍລິການສຳເລັດ" },
                "400": { description: "ຕ້ອງລະບຸ ID" },
                "404": { description: "ບໍ່ພົບ Unit" },
            },
        },
    },
};