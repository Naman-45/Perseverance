import Navbar from "./Components/Navbar.tsx";
import Login from "./Components/Login.tsx";
import Landing from "./Components/Landing.tsx";
import Signup from "./Components/Signup.tsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {

  return (
    <div className="h-screen bg-slate-300">
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
