import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'pitches' })
export class PitchEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'varchar', length: 120 })
  userId!: string;

  @Column({ name: 'project_name', type: 'varchar', length: 255 })
  projectName!: string;

  @Column({ name: 'pitch_text', type: 'text' })
  pitchText!: string;

  @Column({ type: 'varchar', length: 60, nullable: true })
  sector!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
