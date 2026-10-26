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
                                idTypeId: { type: "integer", example: 1 },
                                idCode: { type: "string", example: "B1234567" },
                                isForeigner: { type: "boolean", example: false },
                                firstNameEn: { type: "string", example: "Somsi" },
                                lastNameEn: { type: "string", example: "Jaidee" },
                                firstNameLo: { type: "string", example: "ສົມສີ" },
                                lastNameLo: { type: "string", example: "ໃຈດີ" },
                                dateOfBirth: { type: "string", example: "1990-01-01" },
                                genderId: { type: "integer", example: 1 },
                                phoneNumber: { type: "string", example: "2022111222" },
                                address: { type: "string", example: "Vientiane" },
                            },
                            required: ["idTypeId", "idCode", "isForeigner"],
                        },
                    },
                },
            },
            responses: {
                "201": { description: "ສ້າງຂໍ້ມູນລູກຄ້າສຳເລັດ" },
                "400": { description: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ (ລວມເຖິງເງື່ອນໄຂຊື່ພາສາລາວ/ອັງກິດ)" },
                "401": { description: "Unauthorized" },
                "409": { description: "ລູກຄ້າມີເລກທີເອກະສານນີ້ແລ້ວ" },
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
    "/customers/deleted": {
        get: {
            summary: "ດຶງລາຍຊື່ລູກຄ້າທີ່ຖືກລົບ / Trash Bin (Get Deleted Customers)",
            tags: ["Customers"],
            security: [{ BearerAuth: [] }],
            responses: {
                "200": { description: "ດຶງຂໍ້ມູນລູກຄ້າທີ່ຖືກລົບສຳເລັດ" },
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
            summary: "ຄົ້ນຫາລູກຄ້າຕາມຊື່ (Search Customer By Name)",
            tags: ["Customers"],
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: "name", in: "query", required: true, schema: { type: "string" }, description: "ຊື່ລູກຄ້າທີ່ຕ້ອງການຄົ້ນຫາ" },
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
                "404": { description: "ບໍ່ພົບລູກຄ້າ" },
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
                                idTypeId: { type: "integer", example: 1 },
                                idCode: { type: "string", example: "B1234567" },
                                isForeigner: { type: "boolean", example: false },
                                firstNameEn: { type: "string", example: "Somsi" },
                                lastNameEn: { type: "string", example: "Jaidee" },
                                firstNameLo: { type: "string", example: "ສົມສີ" },
                                lastNameLo: { type: "string", example: "ໃຈດີ" },
                                dateOfBirth: { type: "string", example: "1990-01-01" },
                                genderId: { type: "integer", example: 1 },
                                phoneNumber: { type: "string", example: "2022333444" },
                                address: { type: "string", example: "Vientiane Updated" },
                                isActive: { type: "integer", example: 1 },
                            },
                        },
                    },
                },
            },
            responses: {
                "200": { description: "ແກ້ໄຂຂໍ້ມູນລູກຄ້າສຳເລັດ" },
                "400": { description: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ" },
                "404": { description: "ບໍ່ພົບລູກຄ້າ" },
                "409": { description: "ເລກທີເອກະສານນີ້ມີຢູ່ໃນລະບົບແລ້ວ" },
            },
        },
    },
    "/customers/{id}/disable": {
        patch: {
            summary: "ປິດການໃຊ້ງານຂໍ້ມູນລູກຄ້າ / Soft Delete (Disable Customer)",
            tags: ["Customers"],
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "integer" } },
            ],
            responses: {
                "200": { description: "ປິດການໃຊ້ງານຂໍ້ມູນລູກຄ້າສຳເລັດ" },
                "400": { description: "ID ບໍ່ຖືກຕ້ອງ" },
                "404": { description: "ບໍ່ພົບລູກຄ້າ" },
            },
        },
    },
    "/customers/{id}/enable": {
        patch: {
            summary: "ເປີດການໃຊ້ງານຂໍ້ມູນລູກຄ້າ / Restore (Restore Customer)",
            tags: ["Customers"],
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "integer" } },
            ],
            responses: {
                "200": { description: "ເປີດການໃຊ້ງານຂໍ້ມູນລູກຄ້າສຳເລັດ" },
                "400": { description: "ID ບໍ່ຖືກຕ້ອງ" },
                "404": { description: "ບໍ່ພົບລູກຄ້າ" },
            },
        },
    },
};