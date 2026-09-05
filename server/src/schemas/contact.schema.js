import { z } from 'zod';

// validation for submitting a contact message
export const submitContactMessageSchema = z.object({
    body: z.object({
        name: z.string().trim().min(2, "Name must be at least 2 characters long.").max(100, "Name cannot exceed 100 characters."),
        email: z.string().trim().email("Please enter a valid email address.").toLowerCase().max(255, "Email cannot exceed 255 characters."),
        subject: z.string().trim().min(3, "Subject must be at least 3 characters long.").max(150, "Subject cannot exceed 150 characters."),
        message: z.string().trim().min(10, "Message must be at least 10 characters long.").max(2000, "Message cannot exceed 2000 characters.")
    })
})

// validation for updating a contact message's status (admin)
export const updateContactStatusSchema = z.object({
    params: z.object({
        messageId: z.string().length(24, "Message ID must be 24 characters long.").regex(/^[0-9a-fA-F]{24}$/, "Invalid message ID format.")
    }),
    body: z.object({
        status: z.enum(["NEW", "READ", "RESOLVED"], { message: "Status must be one of NEW, READ, or RESOLVED." })
    })
})