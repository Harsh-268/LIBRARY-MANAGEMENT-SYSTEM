import {z} from 'zod';

//validation schema for searching books by ISBN
export const searchBooksByISBNSchema= z.object({
    params: z.object({
        isbn: z.string().trim().min(1,"ISBN is required for search")
    })
})

//validation schema for adding a book to library
export const addBookToLibrarySchema= z.object({
    body: z.object({
        title: z.string().trim().min(2,"Title must be at least 2 characters long").max(100,"Title must be at most 100 characters long"),
        authors: z.array(z.string().trim().min(2,"Author must be at least 2 characters long").max(100,"Author must be at most 100 characters long")).nonempty("At least one author is required"),
        isbn: z.string().trim().min(10,"ISBN must be at least 10 characters long").max(13,"ISBN must be at most 13 characters long"),
        description: z.string().trim().min(10,"Description must be at least 10 characters long").max(10000,"Description must be at most 1000 characters long"),
        thumbnail: z.string().trim().url(),
        category: z.string().trim().min(2,"Category must be at least 2 characters long").max(50,"Category must be at most 50 characters long"),
        pageCount: z.number().int().positive().min(1,"Page count must be at least 1"),
        totalCopies: z.number().int().positive()
    })
})

//validation schema for updating book details
export const updateBookDetailsSchema= z.object({
    params: z.object({ 
        bookId: z.string().trim().length(24,"Book ID must be 24 characters long").regex(/^[0-9a-fA-F]{24}$/,"Book ID must be a valid hexadecimal string")
    }),
    body: z.object({
        title: z.string().trim().min(2,"Title must be at least 2 characters long").max(200,"Title must be at most 200 characters long").optional(),
        authors: z.array(z.string().trim().min(2,"Author must be at least 2 characters long").max(100,"Author must be at most 100 characters long")).nonempty("At least one author is required").optional(),
        isbn: z.string().trim().min(10,"ISBN must be at least 10 characters long").max(13,"ISBN must be at most 13 characters long").optional(),
        description: z.string().trim().min(10,"Description must be at least 10 characters long").max(1000,"Description must be at most 1000 characters long").optional(),
        thumbnail: z.string().trim().url().optional(),
        category: z.string().trim().min(2,"Category must be at least 2 characters long").max(50,"Category must be at most 50 characters long").optional(),
        pageCount: z.number().int().positive().optional(),
        totalCopies: z.number().int().nonnegative().optional()
    }).strict()
})

//validation schema for deleting a book from library
export const deleteBookFromLibrarySchema= z.object({
    params: z.object({
        bookId: z.string().trim().length(24,"Book ID must be 24 characters long").regex(/^[0-9a-fA-F]{24}$/,"Book ID must be a valid hexadecimal string")
    })      
})

//validation for updating book stock
export const updateBookStockSchema= z.object({
    params: z.object({
        bookId: z.string().trim().length(24,"Book ID must be 24 characters long").regex(/^[0-9a-fA-F]{24}$/,"Book ID must be a valid hexadecimal string")
    }),
    body: z.object({
        changeInCopies: z.number().int()
    })
})

//validation for searching book by id
export const searchBookByIdSchema= z.object({
    params: z.object({
        bookId: z.string().trim().length(24,"Book ID must be 24 characters long").regex(/^[0-9a-fA-F]{24}$/,"Book ID must be a valid hexadecimal string")
    })      
})

//validation for searching books by title or author
export const searchLibraryBooksSchema= z.object({
    query: z.object({
        q: z.string().trim().min(1,"Search query is required")
    })  
})

//validation for searching books by category
export const searchBooksByCategorySchema= z.object({
    params: z.object({
        category: z.string().trim().min(1,"Category is required for search")
    })
})