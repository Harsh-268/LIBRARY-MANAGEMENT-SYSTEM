import {z} from 'zod';
//validation for register controller
export const registerUserSchema = z.object({
    body:z.object({
        fullName:z.string().trim().min(5,"full name must be at least 5 characters long. ").max(100,"full name cannot exceed 100 characters. "),
        email:z.string().trim().email("Please enter a valid email address. ").toLowerCase().max(255,"email cannot exceed 255 characters. "),
        password:z.string().min(6,"Password must be at least 6 characters long. ").max(100,"password cannot exceed 100 characters. ")
    })
})

//validation for login controller
export const loginUserSchema = z.object({
    body:z.object({
        email:z.string().trim().email("Please enter a valid email address. ").toLowerCase().max(255,"email cannot exceed 255 characters. "),
        password:z.string().min(6,"Password must be at least 6 characters long. ").max(100,"password cannot exceed 100 characters. ")
    })
})

//validation for changeUserPassword controller
export const changeUserPasswordSchema = z.object({
    body:z.object({
        oldPassword:z.string().min(6,"Current password must be at least 6 characters long. ").max(100,"current password cannot exceed 100 characters. "),
        newPassword:z.string().min(6,"New password must be at least 6 characters long. ").max(100,"new password cannot exceed 100 characters. ")
    })
})

//validation for searchStudents controller
export const searchStudentsSchema = z.object({
    query: z.object({
        q: z.string().trim().min(1, "Search query is required")
    })
})

//validation for updateUserInfo controller
export const updateUserInfoSchema = z.object({
    body:z.object({
        fullName:z.string().trim().min(5,"full name must be at least 5 characters long. ").max(100,"full name cannot exceed 100 characters. ").optional()
        // email:z.string().trim().email("Please enter a valid email address. ").toLowerCase().max(255,"email cannot exceed 255 characters. ").optional()
    })
})

//validation for updateUserRole controller
export const updateUserRoleSchema = z.object({
    body:z.object({
        userId:z.string().length(24).regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID format. "),
        role:z.enum(["STUDENT","ADMIN"],{message:"Role must be either 'STUDENT' or 'ADMIN'. "})
    })
})

// validation for forgotPassword controller
export const forgotPasswordSchema = z.object({
    body: z.object({
        email: z.string().trim().email("Please enter a valid email address.").toLowerCase()
    })
})

// validation for resetPassword controller
export const resetPasswordSchema = z.object({
    params: z.object({
        token: z.string().min(1, "Reset token is required")
    }),
    body: z.object({
        newPassword: z.string().min(6, "New password must be at least 6 characters long.").max(100)
    })
})
    