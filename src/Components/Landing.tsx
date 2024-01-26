import React from 'react'
import Button from '@mui/material/Button';
import { Navigate, useNavigate } from 'react-router-dom';


const Landing = () => {

    const navigate = useNavigate();

    return (
        <div className='flex flex-col w-6/12 h-6/12 font-serif mt-40 ml-16'>
            <h1 className='text-2xl font-bold  text-blue-600 '>
                Welcome to Perseverance Courses - Your Gateway to Success!
            </h1>
            <h2 className='text-lg font-semibold sky-950 mt-2'>
                Unlock Your Potential, Achieve Your Dreams!
            </h2>
            <div className='mt-2 w-1/4 h-1/4 flex justify-around'>
                <Button variant="contained" onClick={() => {
                    navigate("/Login");
                }}>Login</Button>
                <Button variant="contained" onClick={() => {
                    navigate("/Signup");
                }}>Signup</Button>
            </div>
        </div>
    )
}

export default Landing
