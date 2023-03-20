import axios from 'axios';
const instance = axios.create({ baseURL: 'http://127.0.0.1:8000/api' });
const tokenCookie = document.cookie.split(';').find(cookie => cookie.trim().startsWith('token='));
if (tokenCookie) {
    const token = tokenCookie.split('=')[1];
    instance.defaults.headers.common['Authorization'] = 'Bearer ' + token;
}
export default instance;