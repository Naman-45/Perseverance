import { useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import { Navigate, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import { useSetRecoilState } from 'recoil';
import { user } from '../store/atoms/user'


const Login = () => {
    const [User, setUser] = useState('');
    const [Password, setPassword] = useState('');
    const navigate = useNavigate();
    const setEmail = useSetRecoilState(user)

    const handleClick = async (e) => {
        e.preventDefault();

        const res = await axios.post("http://localhost:3000/users/login", null,
            {
                headers: {
                    username: User,
                    password: Password
                }
            })
        if (res.status >= 200 && res.status < 300) {
            const Data = res.data;
            setEmail({
                isLoading: false,
                userEmail: User
            })
            localStorage.setItem("token", Data.token);
            navigate("/UserPanel");
        }
    }

    return (
        <div className='flex justify-center items-center w-screen h-screen'>
            <Card sx={{ maxWidth: 345 }}>
                <TextField id="outlined-basic" label="Username" variant="outlined" onChange={(e) => {
                    setUser(e.target.value)
                }} /> <br />
                <TextField id="outlined-basic" label="Password" variant="outlined" onChange={(e) => {
                    setPassword(e.target.value)
                }} />
                <Button variant="outlined" onClick={handleClick} type="submit">Submit</Button>
            </Card>
        </div >
    )
}

export default Login
