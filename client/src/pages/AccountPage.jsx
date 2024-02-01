import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Navigate } from "react-router-dom";

const AccountPage = () => {

    const {ready, user} = useContext(UserContext);

    if(ready && !user){
        return <Navigate to={'/login'} />
    }
    // bug : Khi ta refresh thì nó sẽ chuyển đến trang login dù ta đang ở account page 
    // (Lý do ở context ta đặt user mặc đinh là null và phải mất vài mili giây để cập lại user)
    // Giải pháp bổ sung ready

    if(!ready){
        return 'Loading...';
    }

    return(
        // vì user mặc định là null
        <div>account page for {user?.name}</div>
    )
}
export default AccountPage;