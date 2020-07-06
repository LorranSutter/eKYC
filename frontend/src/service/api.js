import axios from 'axios';

import { baseURL } from './baseURL.json'

const api = axios.create({
    baseURL: baseURL
})
export default api;