import { integer, text, boolean, pgTable, varchar, uuid } from "drizzle-orm/pg-core";

export const events = pgTable("events",{
    id: uuid("id").primaryKey(),
    
})