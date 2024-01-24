import React from 'react';
import { useState } from 'react';
import axios from 'axios';



const Login = () => {
    const [User, setUser] = useState('');
    const [Password, setPassword] = useState('');

    return (
        <div>
            <input type="text" onChange={(e) => setUser(e.target.value)} />
            <input type="password" onChange={(e) => { setPassword(e.target.value) }} />
            <button onClick={() => {
                axios.get("http://localhost:3000/user/login",
                    {
                        headers: {
                            username: { User },
                            password: { Password }
                        }
                    })
            }}></button>


        </div >
    )
}

export default Login
