import type {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "./config.js";

export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // 🔥 CHANGE 1: Get the full authorization header (not just "authorization")
    // ISSUE: You were getting req.headers["authorization"] which doesn't include "Bearer "
    // FIX: Get the full header value that includes "Bearer <token>"
    const authHeader = req.headers["authorization"];
    
    // 🔥 CHANGE 2: Check if authorization header exists
    // ISSUE: If no header is sent, your code would try to verify 'undefined' 
    // FIX: Return 403 immediately if no authorization header
    if (!authHeader) {
        return res.status(403).json({
            message: "Authorization header missing"
        });
    }

    // 🔥 CHANGE 3: Check if header starts with "Bearer "
    // ISSUE: Frontend sends "Bearer <token>" but you were trying to verify the whole string
    // FIX: Check format and extract only the token part
    if (!authHeader.startsWith('Bearer ')) {
        return res.status(403).json({
            message: "Invalid authorization format. Expected: Bearer <token>"
        });
    }

    // 🔥 CHANGE 4: Extract only the token (remove "Bearer " prefix)
    // ISSUE: You were verifying "Bearer <token>" instead of just "<token>"
    // FIX: Remove first 7 characters ("Bearer ") to get just the token
    const token = authHeader.substring(7);

    try {
        // 🔥 CHANGE 5: Wrap JWT verification in try-catch
        // ISSUE: jwt.verify() throws an error if token is invalid, causing 500 error
        // FIX: Catch the error and return proper 403 response
        const decoded = jwt.verify(token, JWT_PASSWORD) as any;
        
        // 🔥 CHANGE 6: Check if decoded token has required data
        // ISSUE: Even if verification succeeds, token might not have 'id' field
        // FIX: Verify the token contains the expected user id
        if (!decoded.id) {
            return res.status(403).json({
                message: "Invalid token payload"
            });
        }

        // Set user ID and continue
        req.userId = decoded.id;
        next();
        
    } catch (error) {
        // 🔥 CHANGE 7: Handle JWT verification errors properly  
        // ISSUE: JWT errors were causing 500 Internal Server Error
        // FIX: Catch and return 403 with proper error message
        console.error("JWT verification failed:", error);
        return res.status(403).json({
            message: "Invalid or expired token"
        });
    }
}

// 🔥 CHANGE 8: Add TypeScript interface extension (optional but recommended)
// ISSUE: TypeScript doesn't know about req.userId property
// FIX: Extend Request interface to include userId
declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}