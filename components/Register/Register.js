"use client"
import React, { useState, useRef } from 'react'
import "./Register.css";
import Link from 'next/link';
import { handleRegister } from '@/actions/handleRegister';
import { useRouter, useSearchParams } from 'next/navigation';

import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import { PulseLoader } from "react-spinners";
import { FaCheckCircle } from "react-icons/fa";
import { MdError } from "react-icons/md";
import { IoTriangleSharp } from "react-icons/io5";

const Login = () => {

  const router = useRouter();

  const searchParams = useSearchParams();

  const redirectTo = searchParams.get('redirectTo') || '/signin';

  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [inputErrors, setInputErrors] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [info, setInfo] = useState('')
  const [error, setError] = useState('')

  const inputRefs = useRef({});
  const [focusedField, setFocusedField] = useState(null);

  const resetFields = () => {
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    setInputErrors({ name: '', email: '', password: '', confirmPassword: '' });
    setShowPassword1(false);
    setShowPassword2(false);
    setIsLoading(false);
    setError('')
    setInfo('');
    setFocusedField(null);
  }

  const hasSpecialCharactersOrNumbers = (str) => {
    const nameRegex = /^[A-Za-z\s]+$/;
    if (nameRegex.test(str)) {
      return { success: true };
    } else {
      return { success: false, error: 'Name can only contain alphabets!' };
    }
  };

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
      return { success: false, error: `Password must have at least 8 characters, an uppercase letter, a lowercase letter and a special character` };
    }
  };

  const isSamePassword = (p1, p2) => {
    if (p1 === p2) {
      return { success: true };
    } else {
      return { success: false, error: "Passwords do not match!" };
    }
  };

  const isPrevFieldsValid = (key) => {
    const fields = ["name", "email", "password", "confirmPassword"];
    const currentIndex = fields.indexOf(key);

    for (let i = 0; i < currentIndex; i++) {
      const prevKey = fields[i];
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
    name: hasSpecialCharactersOrNumbers,
    email: isValidEmail,
    password: isValidPassword,
    confirmPassword: (confirmPassword) => isSamePassword(formData.password, confirmPassword)
  };

  const inputField = (type, name, span) => {
    const isPasswordField = name === "password" || name === "confirmPassword";
    const inputType = isPasswordField
      ? (name === "password" ? (showPassword1 ? "text" : "password") : (showPassword2 ? "text" : "password"))
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
        {(focusedField === name && inputErrors[name]) && (
          <div className="input-error-div">
            <div className="pointer-icon"><IoTriangleSharp /></div>{inputErrors[name]}
          </div>
        )}

        {isPasswordField && (
          <button type='button' className="hide-show-btn" onClick={(e) => { name === "password" ? setShowPassword1(!showPassword1) : setShowPassword2(!showPassword2) }}>{name === "password" ? (showPassword1 ? <BiSolidShow /> : <BiSolidHide />) : (showPassword2 ? <BiSolidShow /> : <BiSolidHide />)}</button>
        )}

      </div>
    );
  };

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

    if (!isFormValid()) {
      setError("Please provide all fields!");
      setIsLoading(false);
      resetError();
      return;
    }

    if (!hasSpecialCharactersOrNumbers(formData.name).success) {
      setError("Name cann contain only alphabets!");
      setIsLoading(false);
      resetError();
      return;
    }

    if (!isValidEmail(formData.email).success) {
      setError("Invalid email!");
      setIsLoading(false);
      resetError();
      return;
    }

    if (!isValidPassword(formData.password).success) {
      setError("Invalid password!");
      setIsLoading(false);
      resetError();
      return;
    }

    if (!isSamePassword(formData.password, formData.confirmPassword).success) {
      setError("Password doesn't match!");
      setIsLoading(false);
      resetError();
      return;
    }

    let trimmedName = formData.name.trim();

    const registerUser = await handleRegister({
      name: trimmedName,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
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
      resetError();
      return;
    }

    if (registerUser?.nextError) {
      setError("Something went wrong!");
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
    <main className='signin-container'>
      <div className="blue-box"></div>
      <div className="red-box"></div>
      <div className="white-box">
        <h2 className='signin-title'>Sign-Up</h2>
        <form className="signin-form" onSubmit={(e) => { handleRegisterSubmit(e); }}>
          {inputField('text', 'name', 'Full Name')}
          {inputField('email', 'email', 'Email')}
          {inputField('password', 'password', 'Password')}
          {inputField('password', 'confirmPassword', 'Confirm Password')}

          <button type="submit" className='signin-form-btn' disabled={isLoading || !isFormValid() || error !== ''}>
            <span>{isLoading ? <PulseLoader size={10} margin={4} /> : "Register"}</span>
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
