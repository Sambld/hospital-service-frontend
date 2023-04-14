import axios from '../components/axios';

const useLoader = async(link, abortCont = null) => {
    if (abortCont === null) abortCont = new AbortController();

    return axios.get(link, { signal: abortCont.signal })
        .then(res => {
            return res.data;
        })
        .catch(err => {
            return Promise.reject(err);
        });
};

export default useLoader;