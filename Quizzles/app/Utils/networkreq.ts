import axios from "axios";
import { useToast } from "react-native-toast-notifications";

const baseUrl = "https://quizzle-ht39.onrender.com"; // Replace with your base URL

export const get = async (url: string) => {
  try {
    const response = await axios.get(`${baseUrl}${url}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const post = async (url: string, data: any): Promise<any> => {
  console.log(url, data);
  try {
    const response = await axios.post(url, data);
    return response.data;
  } catch (error) {
    console.error("Error during POST request", error);
    throw error;
  }
};
