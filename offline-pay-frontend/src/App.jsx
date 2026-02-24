import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SendPayment from "./pages/SendPayment";
import ReceivePayment from "./pages/ReceivePayment";
import Profile from "./pages/Profile";

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login toggleTheme={toggleTheme} theme={theme} />} />
        <Route path="/login" element={<Login toggleTheme={toggleTheme} theme={theme} />} />
        <Route path="/register" element={<Register toggleTheme={toggleTheme} theme={theme} />} />
        <Route path="/dashboard" element={<Dashboard toggleTheme={toggleTheme} theme={theme} />} />
        <Route path="/send" element={<SendPayment />} />
        <Route path="/receive" element={<ReceivePayment />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
