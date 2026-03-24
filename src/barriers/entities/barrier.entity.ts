import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'barriers' })
export class BarrierEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'varchar', length: 120 })
  userId!: string;

  @Column({ type: 'varchar', length: 120 })
  barrier!: string;
}
