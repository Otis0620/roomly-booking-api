import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateHotelAndRoom1758751002407 implements MigrationInterface {
    name = 'CreateHotelAndRoom1758751002407'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`hotels\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` text NULL, \`location\` varchar(255) NOT NULL, \`amenities\` json NULL, \`approved\` tinyint NOT NULL DEFAULT 0, \`owner_id\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`rooms\` (\`id\` varchar(36) NOT NULL, \`room_type\` varchar(255) NOT NULL, \`price\` decimal NOT NULL, \`availability\` tinyint NOT NULL, \`hotel_id\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`hotels\` ADD CONSTRAINT \`FK_908426afa479522611c2782db9a\` FOREIGN KEY (\`owner_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rooms\` ADD CONSTRAINT \`FK_7a61484af364d0d804b21b25c7f\` FOREIGN KEY (\`hotel_id\`) REFERENCES \`hotels\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`rooms\` DROP FOREIGN KEY \`FK_7a61484af364d0d804b21b25c7f\``);
        await queryRunner.query(`ALTER TABLE \`hotels\` DROP FOREIGN KEY \`FK_908426afa479522611c2782db9a\``);
        await queryRunner.query(`DROP TABLE \`rooms\``);
        await queryRunner.query(`DROP TABLE \`hotels\``);
    }

}
