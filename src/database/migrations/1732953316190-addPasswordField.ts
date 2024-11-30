import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPasswordField1732953316190 implements MigrationInterface {
  name = 'AddPasswordField1732953316190';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "User" ADD "password" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "User" DROP COLUMN "password"`);
  }
}
