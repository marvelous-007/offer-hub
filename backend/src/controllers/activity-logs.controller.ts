import { Request, Response, NextFunction, Router } from "express";

import { ActivityLogsService } from "@/services";

export const activityLogsRouter = Router();
const activityLogsService = new ActivityLogsService();

activityLogsRouter.post(
    '/',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const log = await activityLogsService.create(req.body);

            res.status(200).json({ log });
        } catch(error) {
            next(error);
        }
    }
);

activityLogsRouter.get(
    '/:id',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            const activityLogs = await activityLogsService.findById(id);
            if (!activityLogs) {
                res.status(200).json({ data: activityLogs });
            } else {
                res.status(404).json({ message: "Activity Log not found." });
            }
        } catch(error) {
            next(error);
        }
    }
);

activityLogsRouter.get(
    '/',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const activityLogs = await activityLogsService.findAll();

            res.status(200).json({ data: activityLogs });
        } catch(error) {
            next(error)
        }
    }
);

activityLogsRouter.post(
    '/:id',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            const data = req.body;

            const result = await activityLogsService.update(id, data);
            if (result) {
                res.status(200).json({ data: result });
            } else {
                res.status(404).json({ data: result });
            }
        } catch(error) {
            next(error);
        }
    }
);
