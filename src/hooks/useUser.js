import { useState } from 'react';
// import useFetch from './useFetch';
import axios from '../components/axios';

export default function useUser() {

    const getUser = () => {
        try {
            const userCookie = document.cookie.split(';').find(cookie => cookie.startsWith('user='));
            if (userCookie) {
                const userInfo = JSON.parse(userCookie.split('=')[1]);
                return userInfo;
            }
            return null;
        } catch {
            return null;
        }

    };

    const [user, setUser] = useState(getUser());

    const saveUser = (userInfo, rememberMe) => {
        let expirationDate = null;
        if (rememberMe) {
            expirationDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 1 month from now
        } else {
            expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day from now
        }

        document.cookie = `user=${JSON.stringify(userInfo.user)}; expires=${expirationDate.toUTCString()}; path=/; SameSite=None; Secure`;
        document.cookie = `token=${userInfo.access_token}; expires=${expirationDate.toUTCString()}; path=/;SameSite=None; Secure`;

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

        document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=None; Secure';
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=None; Secure';

        axios.defaults.headers.common['Authorization'] = null;

        setUser(null);
    };

    return {
        setUser: saveUser,
        deleteUser,
        user
    }
}