
import axios from "axios";

export const API_URL = `${import.meta.env.VITE_API_URL}/api`
export const WS_URL = `${import.meta.env.VITE_WS_URL}/api` 

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`, 
  withCredentials: true, 
});


export default API;
