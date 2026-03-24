import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'communication_trainings' })
export class CommTrainingEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'varchar', length: 120 })
  userId!: string;

  @Column({ type: 'jsonb' })
  skills!: string[];

  @Column({ type: 'jsonb', nullable: true })
  ratings!: Record<string, number> | null;

  @Column({ type: 'jsonb', nullable: true })
  completedModules!: string[] | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
