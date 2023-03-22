import axios from '../components/axios'

const useLoader = async(link, abortCont = null) => {
    if (abortCont === null) abortCont = new AbortController();
    const { data } = await axios.get(link, { signal: abortCont.signal })
        .then(res => {
            return res
        })
        .catch(err => () => abortCont.abort())
    if (data === undefined) return Promise.reject();
    return data
}
export default useLoader;