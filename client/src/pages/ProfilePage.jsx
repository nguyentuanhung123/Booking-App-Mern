import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
//import PlacesPage from "./PlacesPage";
import AccountNav from "../components/AccountNav";

const ProfilePage = () => {

    //let { subpage } = useParams();

    const {ready, user, setUser} = useContext(UserContext);

    const [redirect, setRedirect] = useState(null);

    // if(subpage === undefined){
    //     subpage = 'profile'
    // }

    if(ready && !user){
        return <Navigate to={'/login'} />
    }
    // bug : Khi ta refresh thì nó sẽ chuyển đến trang login dù ta đang ở account page 
    // (Lý do ở context ta đặt user mặc đinh là null và phải mất vài mili giây để cập lại user)
    // Giải pháp bổ sung ready

    if(!ready){
        return 'Loading...';
    }

    //console.log("Subpage : ", subpage); //mặc định là undifined

    const logout = async () => {
        await axios.post('/logout');
        setUser(null);
        setRedirect('/');
    }

    if(redirect){
        return <Navigate to={redirect} />
    }

    return(
        // vì user mặc định là null nên phải thêm ? => user?.name
        // nhưng nếu thêm Loading thì không cần nữa => chắc chắn sẽ có thông tin đăng nhập
        // <div>account page for {user.name}</div>
        <div>
            <AccountNav />
            {/* {
                subpage === 'profile' && 
                    <div className="text-center max-w-lg mx-auto">
                        Logged in as a {user.name} ({user.email})
                        <button onClick={logout} className="primary max-w-sm mt-2">Logout</button>
                    </div> 
            }
            {
                subpage === 'places' && <PlacesPage />
            } */}
            <div className="text-center max-w-lg mx-auto">
                Logged in as a {user.name} ({user.email})
                <button onClick={logout} className="primary max-w-sm mt-2">Logout</button>
            </div> 
        </div>
    )
}
export default ProfilePage;