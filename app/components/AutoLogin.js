import { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";

const AutoLogin = () => {
    const { login } = useContext(AuthContext);

    useEffect(() => {
        login("eve.holt@reqres.in", "cityslicka");
    }, []);

    return null;
};

export default AutoLogin;