import axios from '../components/axios';

const useDelete = async(link, header = null, abortCont = null) => {
    if (abortCont === null) abortCont = new AbortController();
    return axios.delete(link, { signal: abortCont.signal, })
        .then(res => {
            return res.data;
        })
        .catch(err => {
            return Promise.reject(err);
        });
};

export default useDelete;