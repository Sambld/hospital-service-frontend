import axios from '../components/axios'

const useDelete = async(link, header = null, abortCont = null) => {
    if (abortCont === null) abortCont = new AbortController();
    const { data } = await axios.delete(link, { signal: abortCont.signal, headers: header })
        .catch(err => () => abortCont.abort())
    return data
}
export default useDelete;