import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn('uuid')
  service_id: string;

  @Column('uuid')
  freelancer_id: string;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 12, scale: 2 })
  base_price: number;

  @Column('integer')
  delivery_time_days: number;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  // Commented out since User entity might not be fully implemented yet
  // @ManyToOne(() => User, (user) => user.services)
  // @JoinColumn({ name: 'freelancer_id' })
  // freelancer: User;
  
}