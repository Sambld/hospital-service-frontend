import axios from '../components/axios'

const usePost = async(link, formData, header = null, abortCont = null) => {
    if (abortCont === null) abortCont = new AbortController();
    const config = { headers: header };
    return axios.post(link, formData, { signal: abortCont.signal, ...config })
        .then(res => {
            return res.data;
        })
        .catch(err => {
            return Promise.reject(err);
        });
};

export default usePost;