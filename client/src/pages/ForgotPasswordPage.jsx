import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'

const ForgotPasswordPage = () => {

    const { id, token } = useParams();

    const navigate = useNavigate()

    const [password, setPassword] = useState("");

    const [message, setMessage] = useState("");

    const userValid = async() => {
        const res = await axios.get(`/forgotpassword/${id}/${token}`)
                        
        const data = res.data
        if(data.status === 201) {
            console.log("user valid");
        } else {
            navigate("*")
        }
    }

    const setval = (e) => {
        setPassword(e.target.value)
    }

    const sendPassword = async(e) => {
        e.preventDefault();

        const res = await axios.post(`/${id}/${token}`, { password })
                        
        const data = res.data
        if(data.status === 201) {
            setPassword("")
            setMessage(true)
        } else {
           alert("! Token Expired generate new link")
        }
    }
    
    useEffect(() => {
        userValid()
    }, [])

    return (
        <>
            <div className="mt-4 grow flex items-center justify-around">
                <div className="mb-64 p-7 shadow-2xl">
                    <h1 className="text-4xl text-center mb-4 capitalize">Enter your new password</h1>
                    { message ? ( <p className='text-green-500 font-bold'>Password succesfully update.</p>) : ( "" )}
                    <form className="max-w-md mx-auto">
                        <label htmlFor="password" className='font-bold'>New password</label>
                        <input type="password" 
                               placeholder="Enter your new password" 
                               name="password"
                               id="password"
                               value={password}
                               onChange={setval}/>
                        <button className="primary mt-2" onClick={sendPassword}>Send</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default ForgotPasswordPage