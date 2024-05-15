import axios from 'axios'
import { useState } from "react";

const PasswordResetPage = () => {

    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const setVal = (e) => {
        setEmail(e.target.value)
    }

    const sendLink = async (e) => {
        e.preventDefault();

        const res = await axios.post("/sendpasswordlink", { email })

        const data = res.data;

        if(data.status === 201) {
            setEmail("")
            setMessage(true)
        } else {
            alert("Invalid User")
        }
    }

    return(
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64 p-7 shadow-2xl">
                <h1 className="text-4xl text-center mb-4 capitalize">Enter your email</h1>
                {
                    message ? ( <p className='text-green-500 font-bold'>password reset link send successfully in yout email.</p>) : ( "" )
                }
                <form className="max-w-md mx-auto">
                    <label htmlFor='email' className='font-bold'>Email</label>
                    <input type="email" 
                           placeholder="your@email.com" 
                           name='email'
                           id='email'
                           value={email} 
                           onChange={setVal}/>
                    <button className="primary mt-2" onClick={sendLink}>Send</button>
                </form>
            </div>
        </div>
    )
}

export default PasswordResetPage;