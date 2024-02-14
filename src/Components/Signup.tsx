import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Signup = () => {
    const [User, setUser] = useState('');
    const [Password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleClick = async (e) => {
        e.preventDefault();

        const res = await axios.post("http://localhost:3000/users/signup", null,
            {
                headers: {
                    username: User,
                    password: Password
                }
            })
        if (res.status >= 200 && res.status < 300) {
            console.log(res.data.message);
            navigate("/");
        }
        else {
            console.log(res.data.message);
        }
    }
    return (
        <div className='h-screen flex justify-center items-center'>
            <div>
                <div>
                    <h1 className='font-serif'>Welcome to Preseverance, Signup!</h1>
                    <span>Pathway to success.</span>
                </div>
                <form>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <label htmlFor="username">Username</label>
                            <input type="text" id="username" placeholder="Enter Username" onChange={(e) => {
                                setUser(e.target.value)
                            }} /></div>
                        <div className="flex flex-col space-y-1.5">
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" placeholder="Enter Password" onChange={(e) => {
                                setPassword(e.target.value)
                            }} />
                        </div>
                    </div>
                    <button onClick={handleClick} type="submit">Signup</button>

                </form>
            </div>
        </div >

    )
}

export default Signup
