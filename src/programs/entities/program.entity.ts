import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'programs' })
export class ProgramEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 120 })
  name!: string;

  @Column({ type: 'varchar', length: 80 })
  category!: string;
}
