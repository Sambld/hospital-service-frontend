import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useBackListener = (callback) => {
    const navigate = useNavigate();

    useEffect(() => {
        const listener = ({ location, action }) => {
            console.log("listener", { location, action });
            if (action === "POP") {
                callback({ location, action });
            }
        };

        const unlisten = navigate(listener);
        return unlisten;
    }, [callback, navigate]);
};

export default useBackListener;