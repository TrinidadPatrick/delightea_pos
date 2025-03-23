import axios from 'axios'

const http = axios.create({
  baseURL: 'http://192.168.100.34:5000/api/',
  // baseURL: 'http://192.168.0.17:5000/api/',
  // // baseURL: 'http://localhost:5000/api/',
  // baseURL: 'https://delightea-be.vercel.app/api/',
})

export default http;