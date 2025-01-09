"use client"
import React, { useState, useRef } from 'react'
import "./SignIn.css";
import Link from 'next/link';
import { handleLogin } from '@/actions/handleLogin';
import { useRouter, useSearchParams } from 'next/navigation';

import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import { PulseLoader } from "react-spinners";
import { FaCheckCircle } from "react-icons/fa";
import { MdError } from "react-icons/md";
import { IoTriangleSharp } from "react-icons/io5";

const Login = () => {

  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectTo = searchParams.get('redirectTo') || '/';

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [inputErrors, setInputErrors] = useState({ email: '', password: '' });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [info, setInfo] = useState('')
  const [error, setError] = useState('')

  const inputRefs = useRef({});
  const [focusedField, setFocusedField] = useState(null);

  const resetFields = () => {
    setFormData({ email: '', password: '' });
    setInputErrors({ email: '', password: '' });
    setShowPassword(false);
    setIsLoading(false);
    setError('')
    setInfo('');
    setFocusedField(null);
  }

  const isValidEmail = (email) => {
    const emailRegex = /^[A-Za-z][A-Za-z0-9._%+-]*@[A-Za-z0-9-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: "invalid email!" };
    }
    const atCount = email.split('@').length - 1;
    if (atCount !== 1) {
      return { success: false, error: "invalid email!" };
    }
    const domainPart = email.split('@')[1];
    if (!domainPart || domainPart.indexOf('.') === -1) {
      return { success: false, error: "invalid email!" };
    }
    if (domainPart.startsWith('-') || domainPart.endsWith('-')) {
      return { success: false, error: "invalid email!" };
    }
    if (domainPart.includes('..')) {
      return { success: false, error: "invalid email!" };
    }
    const domainSegments = domainPart.split('.');
    for (const segment of domainSegments) {
      if (segment.length < 1 || segment.length > 63 || segment.startsWith('-') || segment.endsWith('-')) {
        return { success: false, error: "invalid email!" };
      }
    }
    if (email.includes('..')) {
      return { success: false, error: "invalid email!" };
    }
    const localPart = email.split('@')[0];
    if (/[._%+-]$/.test(localPart)) {
      return { success: false, error: "invalid email!" };
    }
    if (/^[._%+-]|[._%+-]$/.test(localPart)) {
      return { success: false, error: "invalid email!" };
    }
    if (/([._%+-])\1/.test(localPart)) {
      return { success: false, error: "invalid email!" };
    }
    if (localPart.length > 64) {
      return { success: false, error: "invalid email!" };
    }
    if (/[^A-Za-z0-9._%+-]/.test(localPart)) {
      return { success: false, error: "invalid email!" };
    }
    return { success: true };
  };

  const isValidPassword = (pw) => {
    const isValid =
      pw.length >= 8 &&
      /[A-Z]/.test(pw) &&
      /[a-z]/.test(pw) &&
      /\d/.test(pw) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(pw);

    if (isValid) {
      return { success: true };
    } else {
      return { success: false, error: `` };
    }
  };

  const isPrevFieldsValid = (key) => {
    const fields = ["email", "password"];
    const currentIndex = fields.indexOf(key);

    if (currentIndex > 0) {
      const prevKey = fields[currentIndex - 1];
      const prevFieldValue = formData[prevKey];

      const validation = errorFunctions[prevKey](prevFieldValue);

      if (prevFieldValue.trim() === "" || !validation.success) {
        setInputErrors(prevErrors => ({
          ...prevErrors,
          [prevKey]: prevFieldValue.trim() === "" ? "First fill out this field!" : validation.error
        }));
        inputRefs.current[prevKey].focus();
        return false;
      }
    }
    return true;
  };

  const handleInputChange = (key, value) => {
    if (!isPrevFieldsValid(key)) {
      return;
    }

    const validation = errorFunctions[key](value);
    if (!validation.success) {
      handleInputErrors(key, validation.error);
    } else {
      handleInputErrors(key, '');
    }

    setFormData(prevData => ({ ...prevData, [key]: value }));
  };

  const handleInputErrors = (field, error) => {
    setInputErrors(prevErrors => ({ ...prevErrors, [field]: error }));
  };

  const handleInputFocus = (key) => {
    setFocusedField(key);
    isPrevFieldsValid(key);
  };

  const handleInputBlur = () => {
    setFocusedField(null);
  };

  const errorFunctions = {
    email: isValidEmail,
    password: isValidPassword,
  };

  const inputField = (type, name, span) => {
    const isPasswordField = name === "password";
    const inputType = isPasswordField
      ? (showPassword ? "text" : "password")
      : type;

    return (
      <div className="inputBox">
        <input
          ref={(el) => (inputRefs.current[name] = el)}
          type={inputType}
          className={`${formData[name] !== "" && "valid"} ${inputErrors[name] !== "" && "error"}`}
          name={name}
          value={formData[name]}
          onChange={(e) => { handleInputChange(name, e.target.value); }}
          onFocus={() => handleInputFocus(name)}
          onBlur={handleInputBlur}
          required
        />
        <span>{span}</span>
        {(focusedField === 'email' && inputErrors['email']) && (
          <div className="input-error-div">
            <div className="pointer-icon"><IoTriangleSharp /></div>{inputErrors[name]}
          </div>
        )}

        {isPasswordField && (
          <button type='button' className="hide-show-btn" onClick={(e) => { setShowPassword(!showPassword) }}>{showPassword ? <BiSolidShow /> : <BiSolidHide />}</button>
        )}

      </div>
    );
  };

  const resetError = () => {
    setTimeout(() => {
      setError('');
    }, 4000);
  }

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (isLoading) {
      return;
    }

    setIsLoading(true);

    setInfo('');
    setError('');

    if (!isFormValid()) {
      setError("Please provide all fields!");
      setIsLoading(false);
      resetError();
      return;
    }

    if (!isValidEmail(formData.email).success) {
      setError("Invalid email or password!");
      setIsLoading(false);
      resetError();
      return;
    }

    if (!isValidPassword(formData.password).success) {
      setError("Invalid email or password!");
      setIsLoading(false);
      resetError();
      return;
    }

    const loginUser = await handleLogin({
      email: formData.email,
      password: formData.password,
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
      resetError();
      return;
    }

    if (loginUser?.nextError) {
      setError("Something went wrong. Please try again");
      resetError();
      return;
    }

    if (loginUser?.nextApiError) {
      setError("Something went wrong. Please try again");
      resetError();
      return;
    }

    if (loginUser?.apiError) {
      setError(loginUser.apiError);
      resetError();
      return;
    }
  }

  const isFormValid = () => {
    return (
      Object.values(inputErrors).every(error => error === '') &&
      Object.values(formData).every(value => value.trim() !== '')
    );
  };

  return (
    <main className='login-container'>
      <div className="blue-box"></div>
      <div className="red-box"></div>
      <div className="white-box">
        <h2 className='signin-title'>Sign-In</h2>
        <form className="signin-form" onSubmit={(e) => { handleSignIn(e); }}>
          {inputField('email', 'email', 'Email')}
          {inputField('password', 'password', 'Password')}
          <div className="forgot-password-btn-contianer">
            <Link href={"/forgot-password?redirectTo=/signin"} className="forgot-password-btn">Forgot password?</Link>
          </div>
          <button type="submit" className='signin-form-btn' disabled={isLoading || !isFormValid() || error !== ''}>
            <span >{isLoading ? <PulseLoader size={10} margin={4} /> : "Sign In"}</span>
          </button>
        </form>
        <div className="new-to-brand">
          <div className="no-account-text">Don&apos;t have an account?</div>
          <Link href={`/register?redirectTo=/signin?redirectTo=${redirectTo}`} className='signup-link'>Sign-Up</Link>
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
