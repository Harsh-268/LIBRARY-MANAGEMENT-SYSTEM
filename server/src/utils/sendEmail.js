import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// sends the contact form message to the configured receiver address
// throws on failure so the caller can decide how to handle it (we don't want
// an email failure to block the fact that the message was already saved to the DB)
export const sendContactEmail = async ({ name, email, subject, message }) => {
    await transporter.sendMail({
        from: `"BookStore Contact Form" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: process.env.CONTACT_RECEIVER_EMAIL,
        replyTo: email,
        subject: `[Contact Form] ${subject}`,
        text: `From: ${name} (${email})\n\n${message}`,
        html: `
            <div style="font-family: sans-serif; line-height: 1.6;">
                <p><strong>From:</strong> ${name} (${email})</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <hr />
                <p>${message.replace(/\n/g, "<br/>")}</p>
            </div>
        `
    });
};