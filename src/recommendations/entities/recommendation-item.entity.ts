import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Admin-authored recommendation shown to users on the Recommendations page.
 * Global (not per-user) and fully managed from the admin panel.
 */
@Entity({ name: 'recommendation_items' })
export class RecommendationItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'action_label', type: 'varchar', length: 120, nullable: true })
  actionLabel?: string;

  @Column({ name: 'action_url', type: 'varchar', length: 1000, nullable: true })
  actionUrl?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  category?: string;

  @Column({ type: 'boolean', default: true })
  published!: boolean;

  @Column({ type: 'int', default: 0 })
  order!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
