import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'cvs' })
export class CvEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'varchar', length: 120 })
  userId!: string;

  @Column({ type: 'jsonb' })
  payload!: Record<string, unknown>;
}
