import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'sector_selections' })
export class SectorSelectionEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'varchar', length: 120 })
  userId!: string;

  @Column({ type: 'jsonb' })
  sectors!: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
