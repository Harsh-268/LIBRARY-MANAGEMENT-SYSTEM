import api from "./axios.js";

export const sendContactMessage = async ({ name, email, subject, message }) => {
    const response = await api.post("/contact", { name, email, subject, message });
    return response.data.data;
};