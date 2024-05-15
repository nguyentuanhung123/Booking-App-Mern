import axios from 'axios';
import { useState } from "react";
import { Link } from "react-router-dom";

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');

    const registerUser = async (e) => {
        e.preventDefault();
        try{
            const response = await axios.post('/register',{
                name,
                email,
                password, 
                role
            });
            if(response.data.success){
                alert('Registration successfully. Now you can log in')
            }
            if(response.data.error){
                alert(response.data.message)
            }
        }catch(e){
            alert('Registration failed. Please try again later')
        }
    }

    return(
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64 p-7 shadow-2xl">
                <h1 className="text-4xl text-center mb-4">Register</h1>
                <form className="max-w-md mx-auto" onSubmit={registerUser}>
                    <input type="text" 
                           placeholder="Nguyen Tuan Hung"
                           value={name}
                           onChange={(e) => setName(e.target.value)}/>
                    <input type="email" 
                           placeholder="your@email.com"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}/>
                    <input type="password" 
                           placeholder="password"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}/>
                    <select onChange={(e) => setRole(e.target.value)}>
                        <option value="">--PLEASE SELECT ROLE--</option>
                        <option value="GENERAL">GENERAL</option>
                        <option value="ADMIN">ADMIN</option>
                    </select>
                    <button className="primary">Register</button>
                    <div className="text-center py-2 text-gray-500">
                        Already a member? <Link className="underline text-black" to='/login'>Login</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default RegisterPage;