import axios from '../components/axios'

const usePut = async(link, formData, header = null, abortCont = null) => {
    if (abortCont === null) abortCont = new AbortController();
    const config = { headers: header };
    return axios.put(link, formData, { signal: abortCont.signal, ...config })
        .then(res => {
            return res.data;
        })
        .catch(err => {
            return Promise.reject(err);
        });
};

export default usePut;