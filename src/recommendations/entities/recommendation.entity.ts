import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'recommendations' })
export class RecommendationEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'varchar', length: 120 })
  userId!: string;

  @Column({ name: 'suggested_training', type: 'jsonb' })
  suggestedTraining!: string[];

  @Column({ name: 'suggested_jobs', type: 'jsonb' })
  suggestedJobs!: string[];

  @Column({ name: 'suggested_internships', type: 'jsonb' })
  suggestedInternships!: string[];
}
