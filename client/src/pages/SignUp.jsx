import React, { useState } from "react";
import { useForm } from 'react-hook-form';
import OAuth from "../components/OAuth";
import { Link, useNavigate } from "react-router-dom";

function SignUpForm() {

  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      console.log(formData);

      if (data.success === false) {
        setLoading(false);
        return;
      }
      setLoading(false);
      navigate("/sign-in");
    } catch (e) {
      setLoading(false);
      
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto gap-3">
      <h1 className="text-3xl text-center font-semibold">Sign up</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <input
          type="text"
          className="p-3 border rounded-lg mt-3"
          id="username"
          placeholder="Username"
          name="username"
          {...register('username', { required: true })}
        />
        {errors.username && <p className="text-red-500 mt-5">User name is required.</p>}

        <input
          type="text"
          className="p-3 border rounded-lg"
          id="email"
          placeholder="Email"
          name="email"
          {...register('email', { required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email address' } })}
        />
        {errors.email && <p className="text-red-500 mt-5">Enter a valid email.</p>}

        <input
          type="password"
          className="p-3 border rounded-lg"
          id="password"
          placeholder="Password"
          name="password"
          {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
        />
        {errors.password && <p className="text-red-500 mt-5">Enter a valid password.</p>}

        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg uppercase p-3 hover:opacity-95 disabled:opacity-80"
        >
          {loading ? 'Loading...' : 'Sign up'}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2">
        <p>Have an account?</p>
        <Link to="/sign-in">
          <span className="text-blue-700">Sign in</span>
        </Link>
        {/* {error && <p className="text-red-500 mt-5">{error}</p>} */}
      </div>
    </div>
  );
}

export default SignUpForm;
