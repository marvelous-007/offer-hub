import { Router } from "express";
import {
  createServiceHandler,
  getAllServicesHandler,
  getServiceByIdHandler,
  updateServiceHandler,
  deleteServiceHandler,
} from "@/controllers/service.controller";

const router = Router();

// POST /api/services - Create new service
// Protected route - requires authentication
router.post("/", createServiceHandler);

// GET /api/services - List all services with optional filters
// Public route - no authentication required
router.get("/", getAllServicesHandler);

// GET /api/services/:id - Get service details by ID
// Public route - no authentication required
router.get("/:id", getServiceByIdHandler);

// PATCH /api/services/:id - Update service
// Protected route - requires authentication and ownership verification
router.patch("/:id", updateServiceHandler);

// DELETE /api/services/:id - Delete service (soft delete)
// Protected route - requires authentication and ownership verification
router.delete("/:id", deleteServiceHandler);

export default router;
