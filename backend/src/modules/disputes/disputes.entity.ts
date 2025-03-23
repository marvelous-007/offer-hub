import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { DisputeStatus } from "./disputes.dto";

@Entity("disputes")
export class DisputeEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("uuid")
  transaction_id!: string;

  @Column("uuid")
  user_id!: string;

  @Column("text")
  reason!: string;

  @Column({
    type: "enum",
    enum: DisputeStatus,
    default: DisputeStatus.PENDING,
  })
  status!: DisputeStatus;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at!: Date;
}
