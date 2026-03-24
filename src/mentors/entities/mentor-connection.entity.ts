import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'mentor_connections' })
export class MentorConnectionEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'varchar', length: 120 })
  userId!: string;

  @Column({ name: 'mentor_id', type: 'varchar', length: 120 })
  mentorId!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
