import axios from 'axios';

const isProduction = import.meta.env.PROD;

export const api = axios.create({
  baseURL: isProduction ? '/api' : 'http://localhost:3001'
});
