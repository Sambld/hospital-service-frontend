import axios from '../components/axios'

const usePut = async(link, formData, header = null, abortCont = null) => {
    if (abortCont === null) abortCont = new AbortController();
    const { data } = await axios.put(link, formData, { signal: abortCont.signal, headers: header })
        .catch(err => () => abortCont.abort())
    return data
}
export default usePut;