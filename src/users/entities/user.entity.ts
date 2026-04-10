
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'first_name', type: 'varchar', length: 120 })
  firstName!: string;

  @Column({ name: 'last_name', type: 'varchar', length: 120 })
  lastName!: string;

  @Column({ type: 'int', nullable: true })
  age!: number | null;

  @Column({ type: 'varchar', length: 120, nullable: true })
  ville!: string | null;

  @Column({ name: 'niveau_scolaire', type: 'varchar', length: 120, nullable: true })
  niveauScolaire!: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telephone!: string | null;

  @Column({ type: 'varchar', length: 180, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 20, default: 'user' })
  role!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  passwordHash!: string | null;

  @Column({ name: 'google_id', type: 'varchar', length: 255, nullable: true, unique: true })
  googleId!: string | null;

  @Column({ name: 'avatar_url', type: 'varchar', length: 500, nullable: true })
  avatarUrl!: string | null;

  @Column({ name: 'auth_provider', type: 'varchar', length: 20, default: 'local' })
  authProvider!: string;

  @Column({ name: 'reset_token', type: 'varchar', length: 255, nullable: true })
  resetToken!: string | null;

  @Column({ name: 'reset_token_expires', type: 'timestamp', nullable: true })
  resetTokenExpires!: Date | null;
}
