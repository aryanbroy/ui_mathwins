import axios from 'axios';

export const api = axios.create({
  // baseURL: 'http://192.168.29.2:3000/',
  // baseURL: 'https://mathwins.onrender.com/',
  // baseURL: 'localhost:3000/',
  baseURL: 'http://localhost:3000/',
});
