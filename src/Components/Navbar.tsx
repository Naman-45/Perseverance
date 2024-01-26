import Button from '@mui/material/Button';
import { Navigate, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    return (
        <div className="text-4xl bg-red-500 h-16 flex justify-between">
            <div><h1 className='ml-2 mt-2 font-serif'>Perseverance</h1></div>
            <div className='w-52 h-16 flex justify-around items-center'>
                <Button variant="text" size="large" onClick={() => {
                    navigate("/Login");
                }}>Login</Button>
                <Button variant="contained" onClick={() => {
                    navigate("/Signup");
                }}>Signup</Button>
            </div>
        </div>
    )
}

export default Navbar
