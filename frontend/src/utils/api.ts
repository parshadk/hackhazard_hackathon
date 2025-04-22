
import axios from "axios";
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"
export const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:3000/api"

const API = axios.create({
  baseURL: "http://localhost:3000/api", 
  withCredentials: true, 
});


export default API;
