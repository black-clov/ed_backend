import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'needs_assessments' })
export class NeedsAssessmentEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'varchar', length: 120 })
  userId!: string;

  @Column({ type: 'jsonb' })
  needs!: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
