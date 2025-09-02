import type { NextFunction, Request, Response } from "express";
export declare const userMiddleware: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}
//# sourceMappingURL=middleware.d.ts.map