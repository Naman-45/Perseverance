import Button from '@mui/material/Button';
import { Navigate, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    return (
        <div className="text-4xl bg-red-500 h-16 flex justify-between">
            <div><h1>Perseverance</h1></div>
            <div className='w-48'>
                <Button variant="text" onClick={() => {
                    navigate("/Login");
                }}>Login</Button>
                <Button variant="text" onClick={() => {
                    navigate("/Signup");
                }}>Signup</Button>
            </div>
        </div>
    )
}

export default Navbar
