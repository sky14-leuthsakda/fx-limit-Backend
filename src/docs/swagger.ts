import { authDocs } from "../features/auth/auth.doc.js";
import { userDocs } from "../features/users/user.doc.js";
import { roleDocs } from "../features/roles/role.doc.js";
import { permissionDocs } from "../features/permissions/permission.doc.js";
import { organizationDocs } from "../features/organization/organization.doc.js";
import { sysCodeDocs } from "../features/sys-codes/sys-code.doc.js";
import { exchangeRateDocs } from "../features/exchange-rate/exchange-rate.doc.js";
import { customerDocs } from "../features/customers/customer.doc.js";
import { appConfigDocs } from "../features/app-config/app-config.doc.js";
import { fxTransactionDocs } from "../features/fx-transaction/fx-transaction.doc.js";
import { auditDocs } from "../features/audit-log/audit.doc.js";
import { reportDocs } from "../features/reporting/report.doc.js";

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
        ...userDocs,
        ...roleDocs,
        ...permissionDocs,
        ...organizationDocs,
        ...sysCodeDocs,
        ...exchangeRateDocs,
        ...customerDocs,
        ...appConfigDocs,
        ...fxTransactionDocs,
        ...auditDocs,
        ...reportDocs
    },
};