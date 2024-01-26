import Navbar from "./Components/Navbar.tsx";
import Login from "./Components/Login.tsx";
import Landing from "./Components/Landing.tsx";
import Signup from "./Components/Signup.tsx";
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import * as React from 'react';


function App() {

  return (
    <div className="h-screen bg-blue-50">
      <Router>
        <Navbar />
        <Routes>
          <Route path={"/"} element={<Landing />} />
          <Route path={"/Login"} element={<Login />} />
          <Route path={"/Signup"} element={<Signup />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
