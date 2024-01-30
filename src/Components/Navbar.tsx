import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { user } from '../store/atoms/user';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userLogin } from '../store/selectors/userLogin';
import { isUserLoading } from '../store/selectors/isUserLoading';


const Navbar = () => {
    const navigate = useNavigate();
    const useremail = useRecoilValue(userLogin);
    const setUser = useSetRecoilState(user);
    const isLoading = useRecoilValue(isUserLoading);

    if (isLoading) {
        return <></>
    }

    if (useremail) {
        return (
            <div className="text-4xl bg-red-500 h-16 flex justify-between">
                <div><h1 className='ml-2 mt-2 font-serif'>Perseverance</h1></div>
                <div className='w-52 h-16 flex justify-around items-center'>
                    <Button variant="text" size="large" onClick={() => {
                        navigate("/viewCourses");
                    }}>viewCourses</Button>
                    <Button variant="contained" onClick={() => {
                        localStorage.setItem('token', null);
                        setUser({
                            isLoading: false,
                            userEmail: null,
                        })
                        navigate("/Landing");
                    }}>Logout</Button>
                </div>
            </div>
        )
    }
    else {
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

}

export default Navbar
