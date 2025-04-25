
import axios from "axios";
export const API_URL = import.meta.env.VITE_API_URL || "http://35.153.107.170/api"
export const WS_URL = import.meta.env.VITE_WS_URL || "ws://35.153.107.170//api"

const API = axios.create({
  baseURL: "http://35.153.107.170/api", 
  withCredentials: true, 
});


export default API;
