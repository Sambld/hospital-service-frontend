import axios from '../components/axios'

const useLoader = async(link, abortCont = null) => {
    if (abortCont === null) abortCont = new AbortController();
    const { data } = await axios.get(link, { signal: abortCont.signal })
        .then(res => res.data)
        .catch(err => () => abortCont.abort())
    return data
}
export default useLoader;