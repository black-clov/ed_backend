import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'skills' })
export class SkillEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'varchar', length: 120 })
  userId!: string;

  @Column({ type: 'varchar', length: 80 })
  name!: string;
}
