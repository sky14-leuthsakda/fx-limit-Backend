import { Hono } from "hono";
import authRoutes from "../auth/auth.route.js";
import userRoutes from "../users/user.route.js";
import roleRoutes from "../roles/role.route.js";
import permissionRoutes from "../permissions/permission.route.js";
import orgRoutes from "../organization/organization.route.js";
import sysCodeRoutes from "../sys-codes/sys-code.route.js";
import rateRoutes from "../exchange-rate/exchange-rate.route.js";
import fxTransactionRoutes from "../fx-transaction/fx-transaction.route.js";
import customerRoutes from "../customers/customers.route.js";
import appConfigRoutes from "../app-config/app-config.route.js";
import auditRoutes from "../audit-log/audit.route.js";

const api = new Hono();

// Prefix 
api.route("/auth", authRoutes);
api.route("/users", userRoutes);
api.route("/roles", roleRoutes);
api.route("/permissions", permissionRoutes);
api.route("/org", orgRoutes);
api.route("/sys-codes", sysCodeRoutes);
api.route("/exchange-rate", rateRoutes);
api.route("/fx-transactions", fxTransactionRoutes);
api.route("/customers", customerRoutes);
api.route("/app-config", appConfigRoutes);
api.route("/audit", auditRoutes);

export default api;