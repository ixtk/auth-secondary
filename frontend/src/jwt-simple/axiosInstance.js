import axios from "axios"

const config = {
  baseURL: `http://localhost:3000/jwt-simple`,
  withCredentials: true
}

export const axiosInstance = axios.create(config)

// ამ instance-ზე გამოვიყენებთ logout interceptor-ს
// სხვა მხრივ პარამეტრები იგივეა
export const axiosInterceptorsInstance = axios.create(config)
