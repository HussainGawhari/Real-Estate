import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import About from "./pages/About";
import Search from "./pages/Search";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import Header from "./components/Header";
import PrivateRoute from "../../api/routes/PrivateRoute";
import Profile from "./pages/Profile";
export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="sign-in" element={<SignIn />} />
        <Route path="sign-up" element={<SignUp />} />
        <Route path="search" element={<Search />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element = {<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
