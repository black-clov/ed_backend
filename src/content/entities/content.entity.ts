import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'contents' })
export class ContentEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  body?: string;

  /** article | document | guide */
  @Column({ type: 'varchar', length: 50 })
  type!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  category?: string;

  /** External URL (Google Drive, Dropbox, etc.) */
  @Column({ name: 'file_url', type: 'varchar', length: 1000, nullable: true })
  fileUrl?: string;

  @Column({ name: 'image_url', type: 'varchar', length: 1000, nullable: true })
  imageUrl?: string;

  @Column({ type: 'boolean', default: true })
  published!: boolean;

  @Column({ type: 'int', default: 0 })
  order!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
