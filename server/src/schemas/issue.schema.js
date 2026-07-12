import {z} from 'zod';

const objectIdSchema=z.string().length(24,"ID must be 24 characters long").regex(/^[0-9a-fA-F]{24}$/,"ID must be a valid ObjectId");

//validation for issue book
export const issueBookSchema=z.object({
    body:z.object({
    userId:objectIdSchema,
    bookId:objectIdSchema
    })
})  

//validation for return book
export const returnBookSchema=z.object({
    params:z.object({
        issueId:objectIdSchema
    })
})

//validation for renew book
export const renewBookSchema=z.object({
    params:z.object({
        issueId:objectIdSchema
    })
})

//validation for update fine status
export const updateFineStatusSchema=z.object({
    body:z.object({
        status:z.enum(["PAID","UNPAID"],"Status must be either PAID or UNPAID"),
        issueId:objectIdSchema
    })
})
