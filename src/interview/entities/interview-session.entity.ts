import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'interview_sessions' })
export class InterviewSessionEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'varchar', length: 120 })
  userId!: string;

  @Column({ name: 'target_role', type: 'varchar', length: 120 })
  targetRole!: string;

  @Column({ name: 'scheduled_at', type: 'timestamp', nullable: true })
  scheduledAt!: Date;

  @Column({ type: 'jsonb', nullable: true })
  answers!: Record<string, string>[];

  @Column({ type: 'jsonb', nullable: true })
  feedback!: Record<string, unknown>[];

  @Column({ type: 'int', nullable: true })
  score!: number;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
