import axios from 'axios';

import { baseURL } from './baseURL.json'

const apiWithoutCredentials = axios.create({
    baseURL: baseURL
});

export default apiWithoutCredentials;