import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import { Contact } from "../models/contact.model.js";
import { sendContactEmail } from "../utils/sendEmail.js";
import { paginate } from "../utils/paginate.js";

// public controller
const submitContactMessage = asyncHandler(async (req, res) => {
    const { name, email, subject, message } = req.body;

    const contactMessage = await Contact.create({ name, email, subject, message });

    if (!contactMessage) {
        throw new apiError(500, "Something went wrong while saving your message");
    }

    try {
        await sendContactEmail({ name, email, subject, message });
        contactMessage.emailDelivered = true;
        await contactMessage.save({ validateBeforeSave: false });
    } catch (error) {
        console.error("Failed to send contact email:", error.message);
    }

    return res
        .status(201)
        .json(new apiResponse(201, contactMessage, "Your message has been received. We'll get back to you soon."));
});

// admin controllers
const getAllContactMessages = asyncHandler(async (req, res) => {
    const { page, limit, status } = req.query;

    const query = status ? { status: status.toUpperCase() } : {};

    const { data: messages, metadata } = await paginate({
        model: Contact,
        query,
        page,
        limit,
        sort: { createdAt: -1 }
    });

    return res
        .status(200)
        .json(new apiResponse(200, { messages, metadata }, "Contact messages fetched successfully"));
});

const getContactMessageById = asyncHandler(async (req, res) => {
    const { messageId } = req.params;

    const contactMessage = await Contact.findById(messageId);
    if (!contactMessage) {
        throw new apiError(404, "Contact message not found");
    }

    return res
        .status(200)
        .json(new apiResponse(200, contactMessage, "Contact message fetched successfully"));
});

const updateContactMessageStatus = asyncHandler(async (req, res) => {
    const { messageId } = req.params;
    const { status } = req.body;

    const contactMessage = await Contact.findByIdAndUpdate(
        messageId,
        { $set: { status: status.toUpperCase() } },
        { new: true, runValidators: true }
    );

    if (!contactMessage) {
        throw new apiError(404, "Contact message not found");
    }

    return res
        .status(200)
        .json(new apiResponse(200, contactMessage, "Contact message status updated successfully"));
});

export { submitContactMessage, getAllContactMessages, getContactMessageById, updateContactMessageStatus };