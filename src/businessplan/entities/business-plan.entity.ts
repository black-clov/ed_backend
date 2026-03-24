import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'business_plans' })
export class BusinessPlanEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'varchar', length: 120 })
  userId!: string;

  @Column({ name: 'project_name', type: 'varchar', length: 200 })
  projectName!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ name: 'value_proposition', type: 'text' })
  valueProposition!: string;

  @Column({ name: 'target_customers', type: 'text' })
  targetCustomers!: string;

  @Column({ type: 'text' })
  costs!: string;

  @Column({ name: 'first_steps', type: 'text' })
  firstSteps!: string;

  @Column({ type: 'varchar', length: 40, nullable: true })
  sector!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
