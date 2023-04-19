import axios from '../components/axios'

const usePost = async(link, formData, header = null, abortCont = null) => {
    if (abortCont === null) abortCont = new AbortController();

    return axios.post(link, formData, { signal: abortCont.signal })
        .then(res => {
            return res.data;
        })
        .catch(err => {
            return Promise.reject(err);
        });
};

export default usePost;