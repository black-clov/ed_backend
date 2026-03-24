import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'entrepreneurship_skills' })
export class EntrepreneurshipSkillEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'varchar', length: 120 })
  userId!: string;

  @Column({ type: 'jsonb' })
  skills!: string[];

  @Column({ type: 'jsonb', nullable: true })
  ratings!: Record<string, number> | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
