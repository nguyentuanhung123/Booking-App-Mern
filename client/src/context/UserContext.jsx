import axios from "axios";
import { createContext,  useEffect,  useState } from "react";

export const UserContext = createContext({});

const UserContextProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    //Không thể dùng async await trong đây
    useEffect(() => {
        if(!user){
            //error
            //const response = await axios.get('/profile');
            //setUser(response.data)
            axios.get('/profile').then((res) => {
                setUser(res.data)
            });
        }
    },[])

    return(
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    );
}

export default UserContextProvider;