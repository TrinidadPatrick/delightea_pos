import axios from 'axios'

const http = axios.create({
  // baseURL: 'http://192.168.55.109:5000/api/',
  baseURL: 'https://delightea-be.vercel.app/api/',
})

export default http;