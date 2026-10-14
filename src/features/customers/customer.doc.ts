export const customerDocs = {
    "/customers": {
        post: {
            summary: "ສ້າງຂໍ້ມູນລູກຄ້າໃໝ່ (Create Customer)",
            tags: ["Customers"],
            security: [{ BearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                name: { type: "string", example: "ສົມສີ ໃຈດີ" },
                                idTypeId: { type: "integer", example: 1 },
                                idCode: { type: "string", example: "B1234567" },
                                phone: { type: "string", example: "2022111222" },
                            },
                            required: ["name", "idTypeId", "idCode"],
                        },
                    },
                },
            },
            responses: {
                "201": { description: "ສ້າງຂໍ້ມູນລູກຄ້າສຳເລັດ" },
                "400": { description: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ" },
                "401": { description: "Unauthorized" },
            },
        },
        get: {
            summary: "ດຶງລາຍຊື່ລູກຄ້າທັງໝົດ (Get All Customers)",
            tags: ["Customers"],
            security: [{ BearerAuth: [] }],
            responses: {
                "200": { description: "ດຶງຂໍ້ມູນສຳເລັດ" },
                "401": { description: "Unauthorized" },
            },
        },
    },
    "/customers/paginated": {
        get: {
            summary: "ດຶງລາຍຊື່ລູກຄ້າແບບແບ່ງໜ້າ (Get Customers Paginated)",
            tags: ["Customers"],
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
    "/customers/find": {
        get: {
            summary: "ຄົ້ນຫາລູກຄ້າຕາມ ID Type ແລະ ID Code (Find Customer By ID Code)",
            tags: ["Customers"],
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: "idTypeId", in: "query", required: true, schema: { type: "integer" }, description: "ປະເພດບັດປະຈຳຕົວ" },
                { name: "idCode", in: "query", required: true, schema: { type: "string" }, description: "ເລກທີ່ບັດປະຈຳຕົວ" },
            ],
            responses: {
                "200": { description: "ສຳເລັດ" },
                "400": { description: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ" },
            },
        },
    },
    "/customers/search": {
        get: {
            summary: "ຄົ้นຫາລູກຄ້າຕາມຊື່ (Search Customer By Name)",
            tags: ["Customers"],
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: "name", in: "query", required: true, schema: { type: "string" }, description: "ຊື່ລູກຄ້າที่ຕ້ອງການຄົ້ນຫາ" },
                { name: "limit", in: "query", required: false, schema: { type: "integer" }, description: "ຈຳນວນສູງສຸດທີ່ຕ້ອງການສະແດງ" },
            ],
            responses: {
                "200": { description: "ສຳເລັດ" },
                "400": { description: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ" },
            },
        },
    },
    "/customers/{id}": {
        get: {
            summary: "ດຶງຂໍ້ມູນລູກຄ້າຕາມ ID (Get Customer By ID)",
            tags: ["Customers"],
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "integer" } },
            ],
            responses: {
                "200": { description: "ສຳເລັດ" },
                "400": { description: "ID ຕ້ອງເປັນຕົວເລກທີ່ຖືກຕ້ອງ" },
            },
        },
        put: {
            summary: "ແກ້ໄຂຂໍ້ມູນລູກຄ້າ (Update Customer)",
            tags: ["Customers"],
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
                                name: { type: "string", example: "ສົມສີ ອັບເດດ" },
                                phone: { type: "string", example: "2022333444" },
                            },
                        },
                    },
                },
            },
            responses: {
                "200": { description: "ແກ້ໄຂຂໍ້ມູນລູກຄ້າສຳເລັດ" },
                "400": { description: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ ຫຼື ID ບໍ່ຖືກຕ້ອງ" },
            },
        },
    },
    "/customers/{id}/disable": {
        patch: {
            summary: "ປິດການໃຊ້ງານຂໍ້ມູນລູກຄ້າ (Disable Customer)",
            tags: ["Customers"],
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "integer" } },
            ],
            responses: {
                "200": { description: "ປິດການໃຊ້ງານຂໍ້ມູນລູກຄ້າສຳເລັດ" },
                "400": { description: "ID ບໍ່ຖືກຕ້ອງ" },
            },
        },
    },
    "/customers/{id}/enable": {
        patch: {
            summary: "ເປີດການໃຊ້ງານຂໍ້ມູນລູກຄ້າ (Restore Customer)",
            tags: ["Customers"],
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "integer" } },
            ],
            responses: {
                "200": { description: "ເປີດການໃຊ້ງານຂໍ້ມູນລູກຄ້າສຳເລັດ" },
                "400": { description: "ID ບໍ່ຖືກຕ້ອງ" },
            },
        },
    },
};