import axios from 'axios';
import env from '../assets/env';
const instance = axios.create({ baseURL: env.API_URL + '/api' });
const tokenCookie = document.cookie.split(';').find(cookie => cookie.trim().startsWith('token='));
if (tokenCookie) {
    const token = tokenCookie.split('=')[1];
    instance.defaults.headers.common['Authorization'] = 'Bearer ' + token;
}
export default instance;