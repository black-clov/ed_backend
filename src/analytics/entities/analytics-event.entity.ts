import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'analytics_events' })
export class AnalyticsEventEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'varchar', length: 120, nullable: true })
  userId!: string | null;

  @Column({ type: 'varchar', length: 60 })
  action!: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  target!: string | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata!: Record<string, any> | null;

  @Column({ name: 'ip_address', type: 'varchar', length: 45, nullable: true })
  ipAddress!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
