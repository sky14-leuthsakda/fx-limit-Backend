import type { Context, Next } from 'hono';
import jwt from 'jsonwebtoken';
import type { Variables } from './types.js';
import { AppError } from '../utils/AppError.js';

export const authMiddleware = async (
    c: Context<{ Variables: Variables }>, 
    next: Next
) => {

    const secret = process.env.JWT_SECRET;
    
    if (!secret) {
        console.error("CRITICAL: JWT_SECRET is not defined in environment variables");
        throw new AppError("ເກີດຂໍ້ຜິດພາດທາງດ້ານ Server config", 500);
    }

    const authHeader = c.req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AppError("ກະລຸນາເຂົ້າສູ່ລະບົບກ່ອນ", 401);
    }

    const token = authHeader.split(" ")[1];
    
    if (!token) {
        throw new AppError("Token ບໍ່ຖືກຕ້ອງ", 401);
    }

    try {
        const decoded = jwt.verify(token, secret) as Variables["user"];

        c.set("user", decoded); 

        await next();
    } catch (error){
        throw new AppError("Token ບໍ່ຖືກຕ້ອງ ຫລື ຫມົດອາຍຸ", 401);
    }
};




// Pattern return c.json old verison
// import type { Context, Next } from "hono";
// import jwt from "jsonwebtoken";
// import type { Variables } from "./types.js";

// export const authMiddleware = async (
//     c: Context<{ Variables: Variables }>,
//     next: Next
// ) => {

//     const secret = process.env.JWT_SECRET;
//     if (!secret) {
//         console.error("CRITICAL: JWT_SECRET is not defined in environment variables.");
//         return c.json({
//             success: false,
//             message: "ເກີດຂໍ້ຜີດພາດທາງດ້ານ Server Config"
//         }, 500);
//     }
//     const authHeader = c.req.header("Authorization");

//     if (!authHeader || !authHeader.startsWith("Bearer")) {
//         return c.json({
//             success: false,
//             message: "ກະລຸນາເຂົ້າສູ່ລະບົບກ່ອນ"
//         },
//         401
//         );
//     }

//     const token = authHeader.split(" ")[1];

//     if (!token) {
//         return c.json({
//             success: false,
//             message: "Token ບໍ່ຖືກຕ້ອງ"
//         }, 401);
//     }

//     try {
//         const decoded = jwt.verify(token, secret) as Variables["user"];
//         c.set("user", decoded);
//         await next();
//     } catch (error) {
//         return c.json({
//             success: false,
//             message: "Token ບໍ່ຖືກຕ້ອງ ຫລື ຫມົດອາຍຸ"
//         }, 401);
//     }
// };