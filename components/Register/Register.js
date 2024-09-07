"use client"
import React, { useState, useEffect, useRef } from 'react'
import "./Register.css";
import Link from 'next/link';
import { handleRegister } from '@/actions/handleRegister';
import { useRouter, useSearchParams } from 'next/navigation';

import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import { PulseLoader } from "react-spinners";
import { FaCheckCircle } from "react-icons/fa";
import { MdCancel, MdError, MdHelp } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import { GoDotFill } from "react-icons/go";
import { IoTriangleSharp } from "react-icons/io5";

const Login = () => {

  const router = useRouter();

  const searchParams = useSearchParams();

  const redirectTo = searchParams.get('redirectTo') || '/sign-in';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [info, setInfo] = useState('')
  const [error, setError] = useState('')

  const [showHint, setShowHint] = useState(false);

  const hintRef = useRef(null)

  useEffect(() => {

    function handleClickOutside(event) {
      if (hintRef.current && !hintRef.current.contains(event.target)) {
        setShowHint(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };

  }, [showHint]);

  const resetFields = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword1(false);
    setShowPassword2(false);
    setIsLoading(false);
    setError('')
    setInfo('');
  }

  const hasSpecialCharactersOrNumbers = (str) => {
    const regex = /[^a-zA-Z\s]/;
    return regex.test(str);
  };

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const isValidPassword = (pw) => {
    const isValid =
      pw.length >= 8 &&
      /[A-Z]/.test(pw) &&
      /[a-z]/.test(pw) &&
      /\d/.test(pw) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(pw);

    return isValid;
  }

  const isSamePassword = (p1, p2) => {
    if (p1 === p2) {
      return true;
    }
    else {
      return false;
    }
  }

  const resetError = () => {
    setTimeout(() => {
      setError('');
    }, 4000);
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (isLoading) {
      return;
    }

    setIsLoading(true);

    setInfo('');
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError("Please provide all fields!");
      setIsLoading(false);
      resetError();
      return;
    }

    if (hasSpecialCharactersOrNumbers(name)) {
      setError("Name cann contain only alphabets!");
      setIsLoading(false);
      resetError();
      return;
    }

    if (!isValidEmail(email)) {
      setError("Invalid email!");
      setIsLoading(false);
      resetError();
      return;
    }

    if (!isValidPassword(password)) {
      setError("Invalid password!");
      setIsLoading(false);
      resetError();
      return;
    }

    if (!isSamePassword(password, confirmPassword)) {
      setError("Password doesn't match!");
      setIsLoading(false);
      resetError();
      return;
    }

    let trimmedName = name.trim();

    const registerUser = await handleRegister({
      name: trimmedName,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
    });

    setIsLoading(false);

    if (registerUser?.success) {

      setInfo("User successfully registered!");

      setTimeout(() => {
        router.push(redirectTo);
        router.refresh();
        resetFields();
      }, 1000);

      return;
    }

    if (registerUser?.error) {
      setError(registerUser.error);
      resetError('');
      return;
    }

    if (registerUser?.nextError) {
      setError("Something went wrong!");
      resetError('');
      return;
    }

  }

  return (
    <main className='signin-container'>
      <div className="blue-box"></div>
      <div className="red-box"></div>
      <div className="white-box">
        <h2 className='signin-title'>Sign-Up</h2>
        <form className="signin-form" onSubmit={(e) => { handleRegisterSubmit(e); }}>
          <div className="inputBox">
            <input type="text" className={`${name !== "" && "valid"}`} name="name" value={name} onChange={(e) => { setName(e.target.value); }} required />
            <span>Full Name</span>
          </div>
          <div className="inputBox">
            <input type="email" className={`${email !== "" && "valid"}`} name="email" value={email} onChange={(e) => { setEmail(e.target.value); }} required />
            <span>Email</span>
          </div>
          <div className="inputBox">
            <input className={`${password !== "" && "valid"}`} onFocus={(e) => { setShowHint(true); }} type={showPassword1 ? "text" : "password"} name="password" value={password} onChange={(e) => { setPassword(e.target.value); }} required />
            <span>Password</span>
            <button type='button' disabled={password == ""} className="hide-show-btn" onClick={(e) => { setShowPassword1(!showPassword1) }}>{showPassword1 ? <BiSolidShow /> : <BiSolidHide />}</button>
            <button ref={hintRef} type='button' className="hint-toggle" onClick={(e) => { setShowHint(!showHint) }}><MdHelp /></button>
          </div>
          <div className="inputBox">
            <input type={showPassword2 ? "text" : "password"} className={`${confirmPassword !== "" && "valid"}`} name="confirmPassword" value={confirmPassword} onChange={(e) => { password !== "" && setConfirmPassword(e.target.value) }} required />
            <span>Confirm Password</span>
            <button type='button' disabled={confirmPassword == ""} className="hide-show-btn" onClick={(e) => { setShowPassword2(!showPassword2) }}>{showPassword2 ? <BiSolidShow /> : <BiSolidHide />}</button>
          </div>

          <div className={`password-validation ${showHint && "hint-morph"}`}>
            <div className="pointer-icon"><IoTriangleSharp /></div>
            <div className='valid-title'>Password must have:</div>
            <ul className="password-conditions">
              <li className={`valid-condition`}><GoDotFill style={{ fontSize: ".7rem" }} /> Atleast 8 character. </li>
              <li className={`valid-condition`}><GoDotFill style={{ fontSize: ".7rem" }} /> Atleast 1 upper & lowercase letter. </li>
              <li className={`valid-condition`}><GoDotFill style={{ fontSize: ".7rem" }} /> Atleast 1 digit. </li>
              <li className={`valid-condition`}><GoDotFill style={{ fontSize: ".7rem" }} /> Atleast 1 special character. </li>
            </ul>
          </div>
          <button type="submit" className='signin-form-btn' disabled={isLoading}>
            <span>{isLoading ? <PulseLoader size={10} margin={4} color='#f9f9f7' /> : "Register"}</span>
          </button>

        </form>
        <div className="new-to-brand">
          <div className="no-account-text">Already have an account?</div>
          <Link href={redirectTo} className='signup-link'>Sign-In</Link>
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
