import { Migration } from '@mikro-orm/migrations';

export class Migration20250113102150 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table if not exists "user" (
      "id" varchar(255) not null, 
      "firstName" varchar(255) not null, 
      "lastName" varchar(255) not null,
      "email" varchar(255) not null,
      "password" varchar(255) not null, 
      "created_at" timestamptz not null, 
      "updated_at" timestamptz not null, 
      constraint "user_pkey" primary key ("id")
      );`,
    );
  }
}
