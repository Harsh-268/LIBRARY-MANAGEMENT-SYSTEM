import mongoose from "mongoose";

const issueSchema = new mongoose.Schema({
    book: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Book", 
        required: true 
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    issueDate: { 
        type: Date, 
        default: Date.now 
    },
    dueDate: { 
        type: Date 
    },
    returnDate: { 
        type: Date 
    }, 
    status: { 
        type: String, 
        enum: ["ISSUED", "RETURNED", "OVERDUE"], 
        default: "ISSUED" 
    },
    fine: { 
        type: Number, 
        default: 0 
    },
    fineStatus:{
        type:String,
        enum:["NONE","PAID","UNPAID"],
        default:"NONE"
    },
    renewalCount: { 
        type: Number, 
        default: 0 
    }

}, { timestamps: true });

// pre save hook to save due date
issueSchema.pre("save", function (next) {
    if (!this.dueDate) {
        // default 14 days 
        const date = new Date();
        date.setDate(date.getDate() + 14);
        this.dueDate = date;
    }
    next();
});

export const Issue = mongoose.model("Issue", issueSchema);