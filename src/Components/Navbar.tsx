import Button from '@mui/material/Button';
import { Navigate } from 'react-router-dom';

const Navbar = () => {
    return (
        <div className="text-4xl bg-slate-500 h-16 flex justify-between">
            <h1>Perseverance</h1>
            <div className='m-auto'>
                <Button variant="text" onClick={() => {
                    <Navigate to="/Login" />
                }}>Login</Button>
                <Button variant="text" onClick={() => {
                    <Navigate to="/Signup" />
                }}>Signup</Button>
            </div>
        </div>
    )
}

export default Navbar
