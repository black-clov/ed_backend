import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'mentors' })
export class MentorEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 120 })
  name!: string;

  @Column({ type: 'varchar', length: 120 })
  expertise!: string;
}
