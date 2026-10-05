import { Hono } from "hono";
import { createRateSchema, updateRateSchema } from "./exchange-rate.schema.js";
import * as rateService from "./exchange-rate.service.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";
import type { Variables } from "../../middlewares/types.js";

const rateRoutes = new Hono<{ Variables: Variables}>();
const canEditConfig = requirePermission("CONFIG_EDIT");

// Create New Rate
rateRoutes.post("/", authMiddleware, canEditConfig, async (c) => {
    const body = await c.req.json();
    const validation = createRateSchema.safeParse(body);

    if (!validation.success) {
        return c.json({
            success: false,
            message: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ",
            errors: validation.error?.issues
        }, 400);
    }

    const { userId } = c.get("user");
    const newRate = await rateService.createNewRate(validation.data, userId);
    
    return c.json({
        success: true,
        message: "ບັນທຶກອັດຕາແລກປ່ຽນສຳເລັດ",
        data: newRate
    }, 201);
});

// Rate All
rateRoutes.get("/", authMiddleware, async (c) => {
    const rates = await rateService.getAllRates();
    return c.json({
        success: true,
        data: rates
    });
});

// Rate Paginated
rateRoutes.get("/paginated", authMiddleware, async (c) => {
    const page = Number(c.req.query("page") ?? 1);
    const limit = Number(c.req.query("limit") ?? 20);

    const result = await rateService.getRatePaginated(page, limit);
    
    return c.json({
        success: true,
        data: result.rates,
        pagination: result.pagination
    });
});

// Today's Rate All
rateRoutes.get("/today", authMiddleware, async (c) => {
    const rates = await rateService.getTodayAllRates();
    return c.json({
        success: true,
        data: rates
    });
});


// Today's Rate By CurrencyID
rateRoutes.get("/today/:currencyId", authMiddleware, async (c) => {
    const currencyId = c.req.param("currencyId");

    if (!currencyId)
        return c.json({
        success: false,
        message: "ຕ້ອງລະບຸ Currency ID", 
    }, 400);

    const todayRates = await rateService.getTodayRate(Number(currencyId));

    return c.json({
        success: true,
        data: todayRates
    });
});

// Rate History Per Currency Limit = 30
rateRoutes.get("/history/:currencyId", authMiddleware, async (c) => {
    const currencyId = c.req.param("currencyId");

    if (!currencyId)
        return c.json({
        success: false,
        message: "ຕ້ອງລະບຸ Currency ID", 
    }, 400);

    const limit = Number(c.req.query("limit") ?? 30);

    const history = await rateService.getRateHistory(Number(currencyId), limit);
    return c.json({
        success: true,
        data: history
    });
});

// Rate By Id
rateRoutes.get("/:id", authMiddleware, async (c) => {
    const Id = c.req.param("id");

    if (!Id) {
        return c.json({
            success: false,
            message: "ຕ້ອງລະບຸ ID"
        }, 400);
    }

    const rate = await rateService.getRateById(Number(Id));
    return c.json({
        success: true,
        data: rate
    });
});

// Update Rate
rateRoutes.put("/:id", authMiddleware, canEditConfig, async (c) => {
    const Id = c.req.param("id");

    if (!Id) {
        return c.json({
            success: false,
            message: "ຕ້ອງລະບຸ ID"
        }, 400);
    }

    const body = await c.req.json();
    const validation = updateRateSchema.safeParse(body);

    if (!validation.success) {
        return c.json({
            success: false,
            message: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ",
            errors: validation.error?.issues
        }, 400);
    }

    const { userId } = c.get("user");
    const updatedRate = await rateService.updateExistingRate(Number(Id), validation.data, userId);

    return c.json({
        success: true,
        message: "ການອັບເດດອັດຕາແລກປ່ຽນສຳເລັດ",
        data: updatedRate
    });
});

// Soft Delete Rate
rateRoutes.patch("/:id/disable", authMiddleware, canEditConfig, async (c) => {
    const Id = c.req.param("id");

    if (!Id) {
        return c.json({
            success: false,
            message: "ຕ້ອງລະບຸ ID"
        }, 400);
    }

    const { userId } = c.get("user");
    await rateService.softDeleteRate(Number(Id), userId);

    return c.json({
        success: true,
        message: "ການລຶບອັດຕາແລກປ່ຽນສຳເລັດ"
    })
});

// Restore Rate
rateRoutes.patch("/:id/enable", authMiddleware, canEditConfig, async (c) =>{
    const Id = c.req.param("id");

    if (!Id) {
        return c.json({
            success: false,
            message: "ຕ້ອງລະບຸ ID"
        }, 400);
    }

    const { userId } = c.get("user");
    await rateService.restoreRate(Number(Id), userId);

    return c.json({
        success: true,
        message: "ການກູ້ຄືນອັດຕາແລກປ່ຽນສຳເລັດ"
    })
});

export default rateRoutes;
