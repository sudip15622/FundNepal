"use client"
import React, { useState, useEffect } from 'react'
import "./SignIn.css";
import Link from 'next/link';

import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import { PulseLoader } from "react-spinners";

const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const resetFields = () => {
    setEmail('');
    setPassword('');
    setShowPassword(false);
    setIsLoading(false);
  }

  const handleSignIn = (e) => {
    e.preventDefault();

    console.log("hello");

    setIsLoading(true);

    setTimeout(() => {
      resetFields();
    }, 1000);


  }

  return (
    <main className='login-container'>
      <div className="blue-box"></div>
      <div className="red-box"></div>
      <div className="white-box">
        <h2 className='signin-title'>Sign-In</h2>
        <form className="signin-form" onSubmit={(e)=>{handleSignIn(e);}}>
          <div className="inputBox">
            <input type="email" name="name" id="name" value={email} onChange={(e)=>{setEmail(e.target.value);}} required />
            <span>Email</span>
          </div>
          <div className="inputBox">
            <input type={showPassword ? "text" : "password"} name="password" id="password" value={password} onChange={(e)=>{setPassword(e.target.value);}} required />
            <span>Password</span>
            <button type='button' disabled={password == ""} className="hide-show-btn" onClick={(e)=>{setShowPassword(!showPassword)}}>{showPassword ? <BiSolidShow /> : <BiSolidHide />}</button>
          </div>
          <div className="forgot-password-btn-contianer">
            <button type='button' className="forgot-password-btn">Forgot password?</button>
          </div>
          <button type="submit" className='signin-form-btn' disabled={isLoading}>
            {isLoading ? <PulseLoader size={10} margin={4} color='#f9f9f7'/> : "Sign In"}
          </button>
        </form>
        <div className="new-to-brand">
          <div className="no-account-text">Don&apos;t have an account?</div>
          <Link href={"/sign-up"} className='signup-link'>Sign-Up</Link>
        </div>
      </div>
    </main>
  )
}

export default Login
