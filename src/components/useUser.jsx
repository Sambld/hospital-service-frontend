import { useState } from 'react';
import axios from './axios'

export default function useUser() {

    const getUser = () => {
        const userString = localStorage.getItem('user');
        try {
            const userInfo = JSON.parse(userString);
            const token = "Bearer " + userInfo?.access_token;
            axios.defaults.headers.common['Authorization'] = token;
            return userInfo?.user
        } catch {
            return null
        }
    };

    const [user, setUser] = useState(getUser());



    const saveUser = userInfo => {
        localStorage.setItem('user', JSON.stringify(userInfo));
        setUser(userInfo.user);
        const token = "Bearer " + userInfo.access_token;
        axios.defaults.headers.common['Authorization'] = token;
    };

    const deleteUser = () => {
        try{
            axios.post('/api/logout')
        }catch{
            console.log("Error logging out")
        }
        
        localStorage.removeItem('user');
        setUser(null);
        axios.defaults.headers.common['Authorization'] = null;
    };

    return {
        setUser: saveUser,
        deleteUser,
        user
    }
}