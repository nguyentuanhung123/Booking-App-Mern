/* eslint-disable react/prop-types */
import axios from "axios";
import { createContext,  useEffect,  useState } from "react";

export const UserContext = createContext({});

const UserContextProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false)

    //Không thể dùng async await trong đây
    useEffect(() => {
        if(!user){
            //error
            //const response = await axios.get('/profile');
            //setUser(response.data)
            axios.get('/profile').then((res) => {
                setUser(res.data);
                setReady(true);
            });
        }
    },[])

    return(
        <UserContext.Provider value={{user, setUser, ready}}>
            {children}
        </UserContext.Provider>
    );
}

export default UserContextProvider;