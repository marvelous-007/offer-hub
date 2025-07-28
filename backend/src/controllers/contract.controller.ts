import { Request, Response, NextFunction } from "express";
import { contractService } from "@/services/contract.service";
import { CreateContractDTO, UpdateContractDTO } from "@/types/contract.types";

export const createContractHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const contractData: CreateContractDTO = req.body;

    // Validate required fields
    const {
      contract_type,
      project_id,
      service_request_id,
      freelancer_id,
      client_id,
      contract_on_chain_id,
      amount_locked,
    } = contractData;

    if (
      !contract_type ||
      !freelancer_id ||
      !client_id ||
      !contract_on_chain_id ||
      amount_locked === undefined
    ) {
      res.status(400).json({
        success: false,
        message:
          "Missing required fields: contract_type, freelancer_id, client_id, contract_on_chain_id, amount_locked",
      });
      return;
    }

    // Validate contract type
    if (!["project", "service"].includes(contract_type)) {
      res.status(400).json({
        success: false,
        message: "contract_type must be 'project' or 'service'",
      });
      return;
    }

    // Validate amount
    if (amount_locked <= 0) {
      res.status(400).json({
        success: false,
        message: "amount_locked must be greater than 0",
      });
      return;
    }

    // Validate string fields are not empty
    if (contract_on_chain_id.trim().length === 0) {
      res.status(400).json({
        success: false,
        message: "contract_on_chain_id cannot be empty",
      });
      return;
    }

    const newContract = await contractService.createContract(contractData);

    res.status(201).json({
      success: true,
      message: "Contract created successfully",
      data: newContract,
    });
  } catch (error: any) {
    if (error.message === "Freelancer or client not found") {
      res.status(404).json({
        success: false,
        message: "Freelancer or client not found",
      });
      return;
    }

    if (error.message === "Freelancer and client cannot be the same user") {
      res.status(400).json({
        success: false,
        message: "Freelancer and client cannot be the same user",
      });
      return;
    }

    if (error.message.includes("is required for")) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }

    if (error.message.includes("Invalid")) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }

    next(error);
  }
};

export const getContractByIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Validate UUID format
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid contract ID format",
      });
      return;
    }

    const contract = await contractService.getContractById(id);

    if (!contract) {
      res.status(404).json({
        success: false,
        message: "Contract not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Contract retrieved successfully",
      data: contract,
    });
  } catch (error: any) {
    if (error.message === "Invalid contract ID format") {
      res.status(400).json({
        success: false,
        message: "Invalid contract ID format",
      });
      return;
    }

    next(error);
  }
};

export const updateContractStatusHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData: UpdateContractDTO = req.body;
    const userId = req.body.user_id; // In a real app, this would come from auth middleware

    // Validate UUID format
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid contract ID format",
      });
      return;
    }

    // Validate required fields
    const { escrow_status } = updateData;

    if (!escrow_status) {
      res.status(400).json({
        success: false,
        message: "escrow_status is required",
      });
      return;
    }

    // Validate escrow status
    if (!["funded", "released", "disputed"].includes(escrow_status)) {
      res.status(400).json({
        success: false,
        message: "escrow_status must be 'funded', 'released', or 'disputed'",
      });
      return;
    }

    const updatedContract = await contractService.updateContractStatus(
      id,
      updateData,
      userId
    );

    if (!updatedContract) {
      res.status(404).json({
        success: false,
        message: "Contract not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Contract status updated successfully",
      data: updatedContract,
    });
  } catch (error: any) {
    if (error.message === "Invalid contract ID format") {
      res.status(400).json({
        success: false,
        message: "Invalid contract ID format",
      });
      return;
    }

    if (error.message.includes("Invalid status transition")) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }

    if (error.message.includes("Only the")) {
      res.status(403).json({
        success: false,
        message: error.message,
      });
      return;
    }

    next(error);
  }
};

export const getContractsByUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;

    // Validate UUID format
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
      return;
    }

    const contracts = await contractService.getContractsByUser(userId);

    res.status(200).json({
      success: true,
      message: "User contracts retrieved successfully",
      data: contracts,
    });
  } catch (error: any) {
    if (error.message === "Invalid user ID format") {
      res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
      return;
    }

    next(error);
  }
};

export const getContractsByStatusHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status } = req.params;

    if (!status || !["pending", "funded", "released", "disputed"].includes(status)) {
      res.status(400).json({
        success: false,
        message: "Valid status is required: pending, funded, released, or disputed",
      });
      return;
    }

    const contracts = await contractService.getContractsByStatus(status);

    res.status(200).json({
      success: true,
      message: "Contracts by status retrieved successfully",
      data: contracts,
    });
  } catch (error) {
    next(error);
  }
}; 