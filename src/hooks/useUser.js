import { useState } from 'react';
// import useFetch from './useFetch';
import axios from '../components/axios';


export default function useUser() {

    const getUser = () => {
        const userString = localStorage.getItem('user');
        try {
            const userInfo = JSON.parse(userString);
            return userInfo
        } catch {
            return null
        }
    };

    const [user, setUser] = useState(getUser());



    const saveUser = userInfo => {
        localStorage.setItem('user', JSON.stringify(userInfo.user));
        localStorage.setItem('token', userInfo.access_token);

        const token = "Bearer " + userInfo.access_token;
        axios.defaults.headers.common['Authorization'] = token;

        setUser(userInfo.user);
    };

    const deleteUser = () => {
        try {
            axios.post('/logout')
        } catch {
            console.log("Error logging out")
        }

        localStorage.removeItem('user');
        localStorage.removeItem('token');

        axios.defaults.headers.common['Authorization'] = null;

        setUser(null);
    };

    return {
        setUser: saveUser,
        deleteUser,
        user
    }
}