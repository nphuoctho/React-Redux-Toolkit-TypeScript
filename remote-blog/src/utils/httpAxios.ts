import axios, { AxiosInstance } from 'axios'

export const BASE_API_URL = import.meta.env.VITE_API_BASE_URL

class HttpAxios {
  instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: BASE_API_URL,
      timeout: 10000
    })
  }
}

const http = new HttpAxios().instance

export default http
