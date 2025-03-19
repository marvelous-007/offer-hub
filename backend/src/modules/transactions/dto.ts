import { IsUUID, IsDecimal, IsString, IsIn } from "class-validator";

export class CreateTransactionDto {
  @IsUUID()
  from_user_id: string;

  @IsUUID()
  to_user_id: string;

  @IsUUID()
  project_id: string;

  @IsDecimal()
  amount: number;

  @IsString()
  currency: string;

  @IsString()
  transaction_hash: string;

  @IsIn(["pending", "completed", "failed", "cancelled"])
  status: "pending" | "completed" | "failed" | "cancelled";

  @IsIn(["payment", "escrow_deposit", "escrow_release", "refund"])
  type: "payment" | "escrow_deposit" | "escrow_release" | "refund";
}

export class UpdateTransactionDto {
  @IsDecimal()
  amount?: number;

  @IsString()
  currency?: string;

  @IsIn(["pending", "completed", "failed", "cancelled"])
  status?: "pending" | "completed" | "failed" | "cancelled";

  @IsIn(["payment", "escrow_deposit", "escrow_release", "refund"])
  type?: "payment" | "escrow_deposit" | "escrow_release" | "refund";
}
