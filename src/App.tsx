import Navbar from "./Components/Navbar.tsx";
import Login from "./Components/Login.tsx";
import Landing from "./Components/Landing.tsx";
import Signup from "./Components/Signup.tsx";
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
import { RecoilRoot, useSetRecoilState } from "recoil";
import { user } from './store/atoms/user.js';
import axios from 'axios';
import { useEffect } from 'react';




function App() {

  return (
    <div className="h-screen bg-blue-50">
      <RecoilRoot>
        <Router>
          <Navbar />
          <Init />
          <Routes>
            <Route path={"/"} element={<Landing />} />
            <Route path={"/Login"} element={<Login />} />
            <Route path={"/Signup"} element={<Signup />} />
          </Routes>
        </Router>
      </RecoilRoot>
    </div>
  )
}

function Init() {
  const setUser = useSetRecoilState(user);
  const init = async () => {
    try {
      const response = await axios.get('http://localhost:3000/users/me',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        }
      )

      if (response.data.username) {
        setUser({
          isLoading: false,
          userEmail: response.data.username,
        })
      }
      else {
        setUser({
          isLoading: false,
          userEmail: null,
        })
      }
    }
    catch (e) {
      setUser({
        isLoading: false,
        userEmail: null,
      })
    }
  }
  useEffect(() => {
    init();
  }
    , [])

  return <></>

}

export default App
