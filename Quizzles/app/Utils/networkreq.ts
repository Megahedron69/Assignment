import axios from "axios";
import { useToast } from "react-native-toast-notifications";

const baseUrl = "http://192.168.1.13:3000"; // Replace with your base URL

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
    const response = await axios.post(url, data);
    return response.data;
  } catch (error) {
    console.error("Error during POST request", error);
    throw error;
  }
};
