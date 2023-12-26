import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice";


export default function SignIn() {
  const [formData, setFormData] = useState({});
  // const [error, setError] = useState(null);
  // const [loading, setLoading] = useState(false);
  const { loading , error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      
      dispatch(signInStart);
      const res = await fetch("/api/auth/signin/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (e) {
      dispatch(signInFailure(e.message));
    }
  };


  return (
    <div className=" p-3 max-w-lg mx-auto ">
      <h1 className=" text-3xl text-center font-semibold">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
    
        <input
          type="text"
          className=" p-3 border rounded-lg mt-3"
          id="email"
          placeholder="Email"
          onChange={handleChange}
        />
        <input
          type="text"
          className=" p-3 border rounded-lg"
          id="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <button
        disabled = {loading}
        className="bg-slate-700 text-white rounded-lg uppercase p-3 hover:opacity-95 disabled:opacity-80"
        > {loading ? "Loading..." : "Sign In"}
        </button>
      </form>
      <div className="flex  gap-2">
        <p>Dont Have an account?</p>
        <Link to="/sign-up">
          <span className="text-blue-700">Sign up</span><br />
        </Link>
        {error && <p className='text-red-500 mt-5'>{error}</p>}
      </div>
    </div>
  );
}
