import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'videos' })
export class VideoEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ name: 'video_url', type: 'varchar', length: 500 })
  videoUrl!: string;

  @Column({ name: 'thumbnail_url', type: 'varchar', length: 500, nullable: true })
  thumbnailUrl?: string;

  @Column({ type: 'varchar', length: 100 })
  category!: string;

  @Column({ name: 'duration_seconds', type: 'int', default: 0 })
  durationSeconds!: number;

  @Column({ type: 'int', default: 0 })
  order!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
