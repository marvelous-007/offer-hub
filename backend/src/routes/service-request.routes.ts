import { Router } from "express";
import {
  createServiceRequestHandler,
  getRequestsForFreelancerHandler,
  updateRequestStatusHandler,
} from "@/controllers/service-request.controller";

const router = Router();

router.post("/", createServiceRequestHandler);
router.get("/:freelancerId", getRequestsForFreelancerHandler);
router.patch("/:id", updateRequestStatusHandler);

export default router;
