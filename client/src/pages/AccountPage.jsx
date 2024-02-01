import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Link, Navigate, useParams } from "react-router-dom";

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

    const { subpage } = useParams();
    console.log("Subpage : ", subpage);

    return(
        // vì user mặc định là null nên phải thêm ? => user?.name
        // nhưng nếu thêm Loading thì không cần nữa => chắc chắn sẽ có thông tin đăng nhập
        //<div>account page for {user.name}</div>
        <div>
            <nav className="w-full flex justify-center mt-8 gap-2">
                <Link className="py-2 px-6 bg-primary text-white rounded-full" to={'/account'}>My profile</Link>
                <Link className="py-2 px-6 " to={'/account/bookings'}>My bookings</Link>
                <Link className="py-2 px-6 " to={'/account/places'}>My accommodations</Link>
            </nav>
        </div>
    )
}
export default AccountPage;