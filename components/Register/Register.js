"use client"
import React, { useState, useEffect } from 'react'
import "./Register.css";
import Link from 'next/link';

import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import { PulseLoader } from "react-spinners";

const Login = () => {

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const resetFields = () => {
    setFullName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setShowPassword(false);
    setIsLoading(false);
  }

  const handleRegister = (e) => {
    e.preventDefault();

    console.log("hello");

    setIsLoading(true);

    setTimeout(() => {
      resetFields();
    }, 1000);


  }

  return (
    <main className='signin-container'>
      <div className="blue-box"></div>
      <div className="red-box"></div>
      <div className="white-box">
        <h2 className='signin-title'>Sign-Up</h2>
        <form className="signin-form" onSubmit={(e)=>{handleRegister(e);}}>
          <div className="inputBox">
            <input type="text" name="fullname" id="fullname" value={fullName} onChange={(e)=>{setFullName(e.target.value);}} required />
            <span>Full Name</span>
          </div>
          <div className="inputBox">
            <input type="email" name="name" id="name" value={email} onChange={(e)=>{setEmail(e.target.value);}} required />
            <span>Email</span>
          </div>
          <div className="inputBox">
            <input type="text" name="phone" id="phone" value={phone} onChange={(e)=>{setPhone(e.target.value);}} required />
            <span>Phone No.</span>
          </div>
          <div className="inputBox">
            <input type={showPassword ? "text" : "password"} name="password" id="password" value={password} onChange={(e)=>{setPassword(e.target.value);}} required />
            <span>Password</span>
            <button type='button' disabled={password == ""} className="hide-show-btn" onClick={(e)=>{setShowPassword(!showPassword)}}>{showPassword ? <BiSolidShow /> : <BiSolidHide />}</button>
          </div>
          <button type="submit" className='signin-form-btn' disabled={isLoading}>
            {isLoading ? <PulseLoader size={10} margin={4} color='#f9f9f7'/> : "Register"}
          </button>
        </form>
        <div className="new-to-brand">
          <div className="no-account-text">Already have an account?</div>
          <Link href={"sign-in"} className='signup-link'>Sign-In</Link>
        </div>
      </div>
    </main>
  )
}

export default Login
