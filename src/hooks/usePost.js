import axios from '../components/axios'

const usePost = async(link, formData, header = null, abortCont = null) => {
    if (abortCont === null) abortCont = new AbortController();
    const { data } = await axios.post(link, formData, { signal: abortCont.signal, headers: header })
        .catch(err => () => abortCont.abort())
    return data
}
export default usePost;