
import axios from "axios";
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"
export const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:3000"

const API = axios.create({
  baseURL: "http://localhost:3000", 
  withCredentials: true, 
});


export default API;
