import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddGoogleAuth1712764800000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Make passwordHash nullable for Google-only users
    await queryRunner.changeColumn('users', 'passwordHash', new TableColumn({
      name: 'passwordHash',
      type: 'varchar',
      length: '255',
      isNullable: true,
    }));

    await queryRunner.addColumns('users', [
      new TableColumn({
        name: 'google_id',
        type: 'varchar',
        length: '255',
        isNullable: true,
        isUnique: true,
      }),
      new TableColumn({
        name: 'avatar_url',
        type: 'varchar',
        length: '500',
        isNullable: true,
      }),
      new TableColumn({
        name: 'auth_provider',
        type: 'varchar',
        length: '20',
        default: "'local'",
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'auth_provider');
    await queryRunner.dropColumn('users', 'avatar_url');
    await queryRunner.dropColumn('users', 'google_id');

    await queryRunner.changeColumn('users', 'passwordHash', new TableColumn({
      name: 'passwordHash',
      type: 'varchar',
      length: '255',
      isNullable: false,
    }));
  }
}
