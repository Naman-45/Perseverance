import { useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import { Navigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';



const Login = () => {
    const [User, setUser] = useState('');
    const [Password, setPassword] = useState('');

    return (
        <div className='flex justify-center items-center'>
            <Card sx={{ maxWidth: 345 }}>
                <TextField id="outlined-basic" label="Username" variant="outlined" onChange={(e) => {
                    setUser(e.target.value)
                }} /> <br />
                <TextField id="outlined-basic" label="Password" variant="outlined" onChange={(e) => {
                    setPassword(e.target.value)
                }} />
                <Button variant="outlined" onClick={async () => {
                    const res = await axios.post("http://localhost:3000/users/login",
                        {
                            headers: {
                                username: User,
                                password: Password
                            }
                        })
                    const Data = res.data;
                    localStorage.setItem("token", Data.token);
                    <Navigate to="/Userpanel" />

                }}>Submit</Button>
            </Card>


        </div >
    )
}

export default Login
