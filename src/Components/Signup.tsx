
import axios from 'axios';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import { Navigate } from 'react-router-dom';
import { useState } from 'react';
import TextField from '@mui/material/TextField';

const Signup = () => {
    const [User, setUser] = useState('');
    const [Password, setPassword] = useState('');

    return (
        <div>
            <div className='flex justify-center items-center'>
                <Card sx={{ maxWidth: 345 }}>
                    <TextField id="outlined-basic" label="Username" variant="outlined" onChange={(e) => {
                        setUser(e.target.value)
                    }} /> <br />
                    <TextField id="outlined-basic" label="Password" variant="outlined" onChange={(e) => {
                        setPassword(e.target.value)
                    }} />
                    <Button variant="outlined" onClick={async () => {
                        const res = await axios.post("http://localhost:3000/users/signup",
                            {
                                headers: {
                                    username: User,
                                    password: Password
                                }
                            })
                        if (res.data) {
                            <Navigate to="/" />
                        }

                    }}>Signup</Button>
                </Card>


            </div >
        </div>
    )
}

export default Signup
