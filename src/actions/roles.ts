"use server"

import { db } from "@/db/drizzle";
import { facutly, students } from "@/db/schema";
import { User } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";

type StudentResult = {
    success: true
    data: {
        id: string;
        name: string;
        email: string;
    }
} | {
    success: false
    error: string
}

export async function getStudent(user: User): Promise<StudentResult> {
    try{
        const rows = await db.select()
        .from(students)
        .where(eq(students.email, user.emailAddresses.at(0)?.emailAddress as string))


        if(rows.length <= 0)
            throw new Error("No details found")

        if(!rows.at(0))
            throw new Error("No details found")

        return {
            success: true,
            data: {
                id: rows.at(0)?.id as string,
                name: rows.at(0)?.name as string,
                email: rows.at(0)?.email as string
            }
        }

    }catch(err: unknown){
        return {
            success: false,
            error: "An unexpected error occured"
        }
    }

}

type FacultyResult = {
    success: true
    data: {
        id: string;
        name: string;
        email: string;
        designation: "Assistant Professor" | "Associate Professor" | "Professor" | "lecuturer";
        department: string;
        organizer: boolean;
    }
} | {
    success: false
    error: string
}

export async function getFaculty(user: User): Promise<FacultyResult> {

    try{
        const rows = await db.select()
        .from(facutly)
        .where(eq(facutly.email, user.emailAddresses.at(0)?.emailAddress as string))

        if(rows.length <= 0)
            throw new Error("No details found")

        if(!rows.at(0)) 
            throw new Error("No details found")

        return {
            success: true,
            data: {
                id: rows.at(0)?.id as string,
                name: rows.at(0)?.name as string,
                email: rows.at(0)?.email as string,
                designation: rows.at(0)?.designation as "Assistant Professor" | "Associate Professor" | "Professor" | "lecuturer",
                department: rows.at(0)?.department as string,
                organizer: rows.at(0)?.organizer as boolean
            }
        }
           

    }catch(err: unknown){
        return {
            success: false,
            error: "An unexpected error occured"
        }
    }
}


