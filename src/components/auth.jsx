import useUser from "./useUser";

const auth = ({request}) => {
    const { user, setUser, deleteUser } = useUser();
    return { user, setUser, deleteUser };
}
 
export default auth;