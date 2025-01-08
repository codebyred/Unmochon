"use server"

import { db } from "@/db/drizzle"
import { facutly } from "@/db/schema"
import { eq, and } from "drizzle-orm";

export async function getFacultyByEmail(email: string) {
    try{
        const rows = await db.select()
        .from(facutly)
        .where(eq(facutly.email, email))

        return {success: true, result: rows}
    }catch(error) {
        return {success: false, error: "An unexpected error occured"}
    }
}