import { z } from "zod";

export const Event = z.object({
    id: z.string().uuid().optional(),
    eventName: z.string(),
    lastDateOfRegistration: z.date(),
    lastDateOfProjectSubmission: z.date(),
    requirements: z.string().max(400, "Requirements should not be more than 400 words")
});

export type Event = z.infer<typeof Event>

