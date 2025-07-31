import { Router } from "express";
import {
  createContractHandler,
  getContractByIdHandler,
  updateContractStatusHandler,
  getContractsByUserHandler,
  getContractsByStatusHandler,
} from "@/controllers/contract.controller";

const router = Router();

// POST /api/contracts - Create contract
// Protected route - requires authentication
router.post("/", createContractHandler);

// GET /api/contracts/:id - Get contract details
// Public route - no authentication required
router.get("/:id", getContractByIdHandler);

// PATCH /api/contracts/:id - Update escrow status
// Protected route - requires authentication and authorization
router.patch("/:id", updateContractStatusHandler);

// GET /api/contracts/user/:userId - Get contracts by user
// Public route - no authentication required
router.get("/user/:userId", getContractsByUserHandler);

// GET /api/contracts/status/:status - Get contracts by status
// Public route - no authentication required
router.get("/status/:status", getContractsByStatusHandler);

export default router; 