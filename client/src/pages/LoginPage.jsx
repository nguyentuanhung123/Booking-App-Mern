import axios from "axios";
import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useTranslation } from "react-i18next";

const LoginPage = () => {

    const {t} = useTranslation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const {setUser} = useContext(UserContext);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try{
            const response = await axios.post('/login' , {email, password});//response trả về tất cả các giá trí của User như config , data, ...
            if(response.data.success){
                setUser(response.data.data);
                alert('Login successfull');
                setRedirect(true);
            }
            // console.log("Response of login: ", response);
        }catch(e){
            alert('Login failed');
        }
    }

    if(redirect){
        return <Navigate to={'/'}/>
    }

    return(
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64 p-7 shadow-2xl">
                <h1 className="text-4xl text-center mb-4">{t('login')}</h1>
                <form className="max-w-md mx-auto" onSubmit={handleLoginSubmit}>
                    <input type="email" 
                           placeholder="your@email.com" 
                           value={email} 
                           onChange={(e) => setEmail(e.target.value)}/>
                    <input type="password" 
                           placeholder="password" 
                           value={password} 
                           onChange={(e) => setPassword(e.target.value)}/>
                    <button className="primary">{t('login')}</button>
                    <div className="text-center py-2 text-gray-500">
                    {t('do not have an account yet?')} <Link className="underline text-black" to='/register'>{t('register now')}</Link>
                    </div>
                    <div className="text-center py-2 text-black">
                    {t('forgot Password')} <Link className="underline text-semibold" to='/password-reset'>{t('click here')}!</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default LoginPage;