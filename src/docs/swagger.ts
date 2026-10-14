import { authDocs } from "../features/auth/auth.doc.js";

export const swaggerSpec = {
    openapi: "3.0.0",
    info: {
        title: "Fx Limit System API",
        version: "1.0.0",
        description: "API Documentation ສຳລັບ Frontend",
    },
    servers: [
        {
            url: "http://localhost:3002",
            description: "Local Development Server",
        },
    ],
    // Secuirity Scheme Scalar Authorize Bearer Token
    components: {
        securitySchemes: {
            BearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
                description: "ໃສ່ Token ທີ່ໄດ້ຈາກການ Login (ຮູບແບບ: Bearer <Token>)",
            },
        },
    },
    paths: {
        "/": {
            get: {
                summary: "Check API Status",
                responses: {
                    "200": { description: "Successful response" },
                },
            },
        },
        ...authDocs,
    },
};