"use client"
import React, { useState, useEffect } from 'react'
import "./SignIn.css";
import Link from 'next/link';
import { handleLogin } from '@/actions/handleLogin';
import { useRouter, useSearchParams } from 'next/navigation';

import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import { PulseLoader } from "react-spinners";
import { FaCheckCircle } from "react-icons/fa";
import { MdCancel, MdError } from "react-icons/md";

const Login = () => {

  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectTo = searchParams.get('redirectTo') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [info, setInfo] = useState('')
  const [error, setError] = useState('')

  const resetFields = () => {
    setEmail('');
    setPassword('');
    setShowPassword(false);
    setIsLoading(false);
  }

  const resetError = () => {
    setTimeout(() => {
      setError('');
      // setInfo('');
    }, 4000);
  }

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (isLoading) {
      return;
    }

    setIsLoading(true);

    setInfo('');
    setError('');

    if (!email || !password) {
      setError("Please provide all fields");
      setIsLoading(false);
      resetError();
      return;
    }

    if (!isValidEmail(email)) {
      setError("Invalid email");
      setIsLoading(false);
      resetError();
      return;
    }

    const loginUser = await handleLogin({
      email: email,
      password: password,
      redirect: false,
    })

    setIsLoading(false);

    if (loginUser?.success) {

      setInfo("Successfully signed in");

      setTimeout(() => {
        router.push(redirectTo);
        router.refresh();
        resetFields();
      }, 1000);

      return;
    }

    if (loginUser?.error) {
      setError(loginUser.error);
      resetError('');
      return;
    }

    if (loginUser?.nextError) {
      setError("Something went wrong. Please try again");
      resetError('');
      return;
    }

    if (loginUser?.nextApiError) {
      setError("Something went wrong. Please try again");
      resetError('');
      return;
    }

    if (loginUser?.apiError) {
      setError(loginUser.apiError);
      resetError('');
      return;
    }


  }

  return (
    <main className='login-container'>
      <div className="blue-box"></div>
      <div className="red-box"></div>
      <div className="white-box">
        <h2 className='signin-title'>Sign-In</h2>
        <form className="signin-form" onSubmit={(e) => { handleSignIn(e); }}>
          <div className="inputBox">
            <input type="email" name="email" id="email" value={email} onChange={(e) => { setEmail(e.target.value); }} required />
            <span>Email</span>
          </div>
          <div className="inputBox">
            <input type={showPassword ? "text" : "password"} name="password" id="password" value={password} onChange={(e) => { setPassword(e.target.value); }} required />
            <span>Password</span>
            <button type='button' disabled={password == ""} className="hide-show-btn" onClick={(e) => { setShowPassword(!showPassword) }}>{showPassword ? <BiSolidShow /> : <BiSolidHide />}</button>
          </div>
          <div className="forgot-password-btn-contianer">
            <button type='button' className="forgot-password-btn">Forgot password?</button>
          </div>
          <button type="submit" className='signin-form-btn' disabled={isLoading}>
            {isLoading ? <PulseLoader size={10} margin={4} color='#f9f9f7' /> : "Sign In"}
          </button>
        </form>
        <div className="new-to-brand">
          <div className="no-account-text">Don&apos;t have an account?</div>
          <Link href={"/register"} className='signup-link'>Sign-Up</Link>
        </div>

        <div className={`notifyme ${error && "notifyme-active"}`}>
          <div className="notifyme-top">
            <div className="notifyme-left">
              <button className='notifyme-btn uncheck'><MdError /></button>
              <div className="notifyme-text" style={{ color: "rgb(180, 4, 4)" }}>{error}</div>
            </div>
          </div>
          {error && <div className="notifyme-buttom" style={{ backgroundColor: "rgb(180, 4, 4)" }}></div>}
        </div>
        <div className={`notifyme ${info && "notifyme-active"}`}>
          <div className="notifyme-top">
            <div className="notifyme-left">
              <button className='notifyme-btn check'><FaCheckCircle /></button>
              <div className="notifyme-text" style={{ color: "rgb(1, 126, 8)" }}>{info}</div>
            </div>
          </div>
          {info && <div className="notifyme-buttom" style={{ backgroundColor: "rgb(1, 126, 8)" }}></div>}
        </div>
      </div>
    </main>
  )
}

export default Login
