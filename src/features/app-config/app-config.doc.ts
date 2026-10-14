export const appConfigDocs = {
    "/app-configs": {
        post: {
            summary: "Create App Config",
            tags: ["App Configs"],
            security: [{ BearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                configKey: { type: "string", example: "MONTHLY_LIMIT_USD" },
                                configValue: { type: "string", example: "50000" },
                                description: { type: "string", example: "Monthly exchange limit cap" },
                            },
                            required: ["configKey", "configValue"],
                        },
                    },
                },
            },
            responses: {
                "201": { description: "Config created successfully" },
                "400": { description: "Invalid data" },
                "401": { description: "Unauthorized" },
                "403": { description: "Forbidden (Insufficient permissions)" },
            },
        },
        get: {
            summary: "Get All App Configs",
            tags: ["App Configs"],
            security: [{ BearerAuth: [] }],
            responses: {
                "200": { description: "Successful response" },
                "401": { description: "Unauthorized" },
            },
        },
    },
    "/app-configs/{configKey}": {
        get: {
            summary: "Get App Config By Key",
            tags: ["App Configs"],
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: "configKey", in: "path", required: true, schema: { type: "string" } },
            ],
            responses: {
                "200": { description: "Successful response" },
                "400": { description: "Config key is required" },
            },
        },
        put: {
            summary: "Update App Config",
            tags: ["App Configs"],
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: "configKey", in: "path", required: true, schema: { type: "string" } },
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                configValue: { type: "string", example: "60000" },
                                description: { type: "string", example: "Updated limit cap" },
                            },
                        },
                    },
                },
            },
            responses: {
                "200": { description: "Config updated successfully" },
                "400": { description: "Invalid data" },
                "403": { description: "Forbidden" },
            },
        },
    },
    "/app-configs/{configKey}/disable": {
        patch: {
            summary: "Disable App Config",
            tags: ["App Configs"],
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: "configKey", in: "path", required: true, schema: { type: "string" } },
            ],
            responses: {
                "200": { description: "Config disabled successfully" },
                "400": { description: "Config key is required" },
            },
        },
    },
    "/app-configs/{configKey}/enable": {
        patch: {
            summary: "Restore App Config",
            tags: ["App Configs"],
            security: [{ BearerAuth: [] }],
            parameters: [
                { name: "configKey", in: "path", required: true, schema: { type: "string" } },
            ],
            responses: {
                "200": { description: "Config restored successfully" },
                "400": { description: "Config key is required" },
            },
        },
    },
};