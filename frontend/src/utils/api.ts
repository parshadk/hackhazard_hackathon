
import axios from "axios";
<<<<<<< HEAD

export const API_URL = `${import.meta.env.VITE_API_URL}/api`
export const WS_URL = `${import.meta.env.VITE_WS_URL}/api` 

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`, 
=======
export const API_URL = import.meta.env.VITE_API_URL || "http://35.153.107.170/api"
export const WS_URL = import.meta.env.VITE_WS_URL || "ws://35.153.107.170//api"

const API = axios.create({
  baseURL: "http://35.153.107.170/api", 
>>>>>>> 085381b (sidebar)
  withCredentials: true, 
});


export default API;
