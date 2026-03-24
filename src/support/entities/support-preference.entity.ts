import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'support_preferences' })
export class SupportPreferenceEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'varchar', length: 120 })
  userId!: string;

  @Column({ type: 'jsonb' })
  preferences!: string[];

  @Column({ type: 'jsonb', nullable: true })
  details!: Record<string, string> | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
