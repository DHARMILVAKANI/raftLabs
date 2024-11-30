import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLoginHistoryTable1732956230530 implements MigrationInterface {
  name = 'AddLoginHistoryTable1732956230530';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "UserLoginHistory" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" character varying(300), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedBy" character varying(300), "deletedAt" TIMESTAMP, "deletedBy" character varying(255), "accessToken" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_dde2c5f047db10c99539da50d12" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserLoginHistory" ADD CONSTRAINT "FK_ed7eb709f0523294dcce6e02c47" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "UserLoginHistory" DROP CONSTRAINT "FK_ed7eb709f0523294dcce6e02c47"`,
    );
    await queryRunner.query(`DROP TABLE "UserLoginHistory"`);
  }
}
