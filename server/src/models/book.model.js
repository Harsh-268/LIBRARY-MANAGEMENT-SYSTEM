import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true, 
        index: true 
    },
    authors: [{ 
        type: String 
    }],
    isbn: { 
        type: String, 
        required: true, 
        unique: true 
    }, 
    description: { 
        type: String
    },
    thumbnail: { 
        type: String 
    }, 
    category: { 
        type: String 
    },
    totalCopies: { 
        type: Number, 
        default: 1 
    },
    availableCopies: { 
        type: Number, 
        default: 1 
    },
    location: { 
        type: String 
    }, 
}, { timestamps: true });

export const Book = mongoose.model("Book", bookSchema);