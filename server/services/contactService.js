import axios from "axios";

// Base URL (change when deploying)
const API_URL = "http://localhost:5000/api/contact";

// Send contact message
export const sendContactMessage = async (formData) => {
    try {
        const response = await axios.post(API_URL, formData);
        return response.data;
    } catch (error) {
        // Handle error properly
        throw error.response?.data || { message: "Something went wrong" };
    }
};