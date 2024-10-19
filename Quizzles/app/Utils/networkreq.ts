import axios from "axios";
const baseUrl = "https://quizzle-ht39.onrender.com";

export const get = async (url: string) => {
  try {
    const response = await axios.get(`${baseUrl}${url}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const post = async (url: string, data: any): Promise<any> => {
  try {
    const response = await axios.post(`${baseUrl}${url}`, data);
    return response.data;
  } catch (error) {
    console.error("Error during POST request", error);
    throw error;
  }
};
