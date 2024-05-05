import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { Navigate } from "react-router-dom";
import axios from "axios";
//import PlacesPage from "./PlacesPage";
import AccountNav from "../components/AccountNav";

const ProfilePage = () => {

    //let { subpage } = useParams();

    const {ready, user, setUser} = useContext(UserContext);

    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [gender, setGender] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");

    const [redirect, setRedirect] = useState(null);

    useEffect(() => {
        setId(user?._id); // Update id state variable with user's _id
        setName(user?.name); // Update name state variable with user's name
        setGender(user?.gender); // Update gender state variable with user's gender
        setPhone(user?.phone); // Update phone state variable with user's phone number
        setDateOfBirth(user?.dateOfBirth); // Update dateOfBirth state variable with user's date of birth
    }, [user]);


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

    const onChangeUserName = (event) => {
        const { value } = event.target
        if(user){
            setUser({
                ...user,
                name: value
            })
        }
    }

    const onChangeUserGender = (event) => {
        const { value } = event.target
        if(user){
            setUser({
                ...user,
                gender: value
            })
        }
    }

    const onChangeUserPhone = (event) => {
        const { value } = event.target
        if(user){
            setUser({
                ...user,
                phone: value
            })
        }
    }

    const onChangeUserDateOfBirth = (event) => {
        const { value } = event.target
        if(user){
            setUser({
                ...user,
                dateOfBirth: value
            })
        }
    }

    const logout = async () => {
        await axios.post('/logout');
        setUser(null);
        setRedirect('/');
    }

    const editProfile = async () => {
        const response = await axios.put('/editProfile' , {
            id, name, gender, phone, dateOfBirth
        });
        if(response.data.success){
            alert("Update User successfully")
            setRedirect('/');
        }
        // console.log("Id in profile page: ", id);
        // console.log("Name in profile page: ", name);
        // console.log("Genger in profile page: ", gender);
        // console.log("Phone in profile page: ", phone);
        // console.log("DateOfBirth in profile page: ", dateOfBirth);
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
                <div className="grid">
                    <label>Name : </label>
                    <input type="text" value={user.name} onChange={(e) => onChangeUserName(e)}></input>
                </div>
                <div className="grid">
                    <label>Email : </label>
                    <input type="text" value={user.email}></input>
                </div>
                <div className="grid">
                    <label>Gender : </label>
                    <select className="w-full h-full outline-none bg-transparent border-none" value={user && user.gender ? user.gender : ''}  onChange={onChangeUserGender}>
                        <option value=""></option>
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                    </select>
                </div>
                <div className="grid">
                    <label>Date of birth : </label>
                    <input type="date" value={user && user.dateOfBirth ? user.dateOfBirth : ''} onChange={(e) => onChangeUserDateOfBirth(e)}></input>
                </div>
                <div className="grid">
                    <label>Phone : </label>
                    <input type="number" value={user && user.phone ? user.phone : ''} onChange={(e) => onChangeUserPhone(e)}></input>
                </div>
                <button onClick={editProfile} className="primary max-w-sm mt-2">Edit Profile</button>
                <button onClick={logout} className="primary max-w-sm mt-2">Logout</button>
            </div> 
        </div>
    )
}
export default ProfilePage;