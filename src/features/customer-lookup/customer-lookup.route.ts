import { Hono } from "hono";
import * as customerService from "./customer-lookup.service.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import type { Variables } from "../../middlewares/types.js";


const customerRoutes = new Hono<{ Variables: Variables }>();

customerRoutes.get("/search", authMiddleware, async (c) => {
    const keyword = c.req.query("keyword");
    if (!keyword) {
        return c.json({
            success: false,
            message: "ກະລຸນາປ້ອນຄຳຄົ້ນຫາ"
        }, 400);
    }

    const page = Number(c.req.query("page") ?? 1);
    const limit = Number(c.req.query("limit") ?? 10);

    if (page < 1 || limit < 1 ) {
        return c.json({
            success: false,
            message: "page ແລະ limit ຕ້ອງຫລາຍກວ່າ 0"
        }, 400);
    }

    const result = await customerService.searchCustomersPaginated(
        keyword,
        page,
        limit
    );

    return c.json({
        success: true,
        message: "ຄົ້ນຫາລູກຄ້າສຳເລັດ",
        data: result.customers,
        pagination: result.pagination,
    });
});

customerRoutes.get("/:customerIdCode", authMiddleware, async (c) => {
    const customerIdCode = c.req.param("customerIdCode");
    if (!customerIdCode) {
        return c.json({
            success: false,
            message: "ຕ້ອງລະບຸລະຫັດລູກຄ້າ"
        }, 400);
    }

    const detail = await customerService.getCustomerDetail(customerIdCode);
    return c.json({
        success: true,
        data: detail
    });
});

export default customerRoutes;