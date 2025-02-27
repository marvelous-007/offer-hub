import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid', { name: 'user_id' })
  userId: string;

  @Column({ name: 'wallet_address', length: 100, unique: true })
  walletAddress: string;

  @Column({ nullable: true, unique: true })
  email: string;

  @Column({ length: 50, unique: true })
  username: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @Column({ name: 'last_login', type: 'timestamp with time zone', nullable: true })
  lastLogin: Date;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'two_factor_enabled', default: false })
  twoFactorEnabled: boolean;
}