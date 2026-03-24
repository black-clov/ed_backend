import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'opportunities' })
export class OpportunityEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 120 })
  title!: string;

  @Column({ type: 'varchar', length: 40 })
  type!: string;

  @Column({ type: 'varchar', length: 120 })
  location!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ name: 'required_skills', type: 'jsonb', nullable: true, default: '[]' })
  requiredSkills!: string[];

  @Column({ name: 'suitable_for_needs', type: 'jsonb', nullable: true, default: '[]' })
  suitableForNeeds!: string[];
}
