import { sqliteTable,text,integer } from 'drizzle-orm/sqlite-core';
export const sessions=sqliteTable('covenant_sessions',{id:text('id').primaryKey(),revision:integer('revision').notNull().default(0),body:text('body').notNull(),updatedAt:integer('updated_at').notNull()});
