"use client"
import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import "./ForgotPassword.css";
import { PulseLoader } from 'react-spinners';

import { isValidEmail } from '@/utils/validateFundraiser';
import { handleEmailCheck, handleVerifyOtp, handleSetNewPassword } from '@/actions/handleForgotPassword';

import { MdError } from 'react-icons/md';
import { BiSolidHide, BiSolidShow } from "react-icons/bi";

const ForgotPassword = () => {

    const router = useRouter();
    const searchParams = useSearchParams();

    const redirectTo = searchParams.get('redirectTo') || 'signin';

    const [otpMode, setOtpMode] = useState(false);
    const [passwordMode, setPasswordMode] = useState(false);

    const [email, setEmail] = useState('');
    const [emailLoading, setEmailLoading] = useState(false);
    const [emailError, setEmailError] = useState('');

    const [otp, setOtp] = useState('');
    const [otpLoading, setOtpLoading] = useState(false);
    const [otpError, setOtpError] = useState('');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [passwordInfo, setPasswordInfo] = useState('');

    const [showPw1, setShowPw1] = useState(false);
    const [showPw2, setShowPw2] = useState(false);


    const handleEmailChange = (value) => {
        setEmail(value);
    }

    const handleOtpChange = (value) => {
        setOtp(value);
    }

    const handleEmailSubmit = async (e) => {
        e.preventDefault();

        if (emailLoading) return;
        setEmailLoading(true);
        setEmailError('');

        if (email.trim() === '') {
            setEmailError("Email is required!");
            setEmailLoading(false);
            return;
        }

        if (!isValidEmail(email)) {
            setEmailError("Please enter a valid email!");
            setEmailLoading(false);
            return;
        }

        const response = await handleEmailCheck(email);
        if (response.success) {
            setOtpMode(true);
            setEmailError('');
            setEmailLoading(false);
        } else {
            setEmailError(response.error ? response.error : "Something went wrong!");
            setEmailLoading(false);
            setOtpMode(false);
            return;
        }

    }

    const isValidOtp = (otp) => {
        if (/^\d{6}$/.test(otp)) {
            return { success: true };
        } else {
            return { success: false, error: "Invalid OTP" };
        }
    }

    const handleOtpSubmit = async (e) => {
        e.preventDefault();

        if (otpLoading) return;
        setOtpLoading(true);
        setOtpError('');

        if (otp.trim() === '') {
            setOtpError("OTP is required!");
            setOtpLoading(false);
            return;
        }

        if (!isValidOtp(otp).success) {
            setOtpError("Invalid OTP");
            setOtpLoading(false);
            return;
        }

        const response = await handleVerifyOtp(email, otp);
        if (response.success) {
            setPasswordMode(true);
            setOtpError('');
            setOtpLoading(false);
        } else {
            setOtpError(response.error ? response.error : "Something went wrong!");
            setOtpLoading(false);
            return;
        }
    }

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
            return { success: false, error: '' };
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        if (passwordLoading) return;
        setPasswordLoading(true);
        setPasswordError('');
        setPasswordInfo('');

        if (password.trim() === '' || confirmPassword.trim() === '') {
            setPasswordError("Both field are required!");
            setPasswordLoading(false);
            return;
        }

        if (!isValidPassword(password).success || !isValidPassword(confirmPassword).success) {
            setPasswordError("Password must contain atleast 8 character including 1 uppercase, lowecase, & special character!");
            setPasswordLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            return {
                success: false,
                error: "Passwords do not match!",
            }
        }

        const response = await handleSetNewPassword(email, password, confirmPassword);
        if (response.success) {
            setPasswordInfo("Password changed successfully!");
            setPasswordLoading(false);
            setTimeout(() => {
                router.push(redirectTo);
                // setPasswordMode(false);
                // setOtpMode(false);
                setEmail('');
                setOtp('');
                setPassword('');
                setConfirmPassword('');
            }, 2000);
        } else {
            setPasswordError(response.error ? response.error : "Something went wrong!");
            setPasswordLoading(false);
            // setOtpMode(false);
            return;
        }
    }

    const handleResendCode = async () => {
        setOtpMode(false);
        setPasswordMode(false);
        setOtpError('');
        setOtp('');
        setOtpLoading(false);
        setEmailError('');
    }


    return (
        <main className='fp-forgot-container'>
            {passwordMode ? (
                <div className='fp-content-box'>
                    <picture className='fp-image-container'>
                        <Image className='fp-image' src="/forgot_password.jpg" width={100} height={90} priority alt="forgot-password-image" />
                    </picture>

                    <h1 className='fp-forgot-title'>Set New Password</h1>

                    <p className='fp-forgot-text'>Enter a new password, you need to change your password</p>

                    <form className='fp-email-form' onSubmit={(e) => { handlePasswordSubmit(e); }}>
                        <div className="fp-input-box">
                            <input type={showPw1 ? "text" : "password"} placeholder='Enter new Password' className='fp-input' value={password} onChange={(e) => { setPassword(e.target.value); }} required />
                            <span className="fp-pw-icon" onClick={() => { setShowPw1(!showPw1); }}>{showPw1 ? <BiSolidShow /> : <BiSolidHide />}</span>
                        </div>
                        <div className="fp-input-box">
                            <input type={showPw2 ? "text" : "password"} placeholder='Confirm new Password' className='fp-input' value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); }} required />
                            <span className="fp-pw-icon" onClick={() => { setShowPw2(!showPw2); }}>{showPw2 ? <BiSolidShow /> : <BiSolidHide />}</span>
                        </div>
                        {passwordError !== '' && (
                            <div className='fp-error'>
                                <span className="fp-error-icon"><MdError /></span>
                                <span className="fp-error-text">{passwordError}</span>
                            </div>
                        )}
                        <button disabled={password.trim() === '' || confirmPassword.trim() === ''} type='submit' className='fp-button'>{passwordLoading ? <PulseLoader size={10} margin={4} /> : "Confirm"}</button>
                    </form>
                </div>
            ) : <>
                {otpMode ? (
                    <div className='fp-content-box'>
                        <picture className='fp-image-container'>
                            <Image className='fp-image' src="/forgot_password.jpg" width={100} height={90} priority alt="forgot-password-image" />
                        </picture>

                        <h1 className='fp-forgot-title'>Enter OTP</h1>

                        <p className='fp-forgot-text'>Enter the otp sent to your email</p>

                        <form className='fp-email-form' onSubmit={(e) => { handleOtpSubmit(e); }}>
                            <input type='number' placeholder='Enter OTP' className='fp-input' value={otp} onChange={(e) => { handleOtpChange(e.target.value); }} required />
                            <div className="fp-resend-code">
                                <span>Didn't receive the code?</span>
                                <div onClick={(e) => {handleResendCode();}}>Resend</div>
                            </div>
                            {otpError !== '' && (
                                <div className='fp-error'>
                                    <span className="fp-error-icon"><MdError /></span>
                                    <span className="fp-error-text">{otpError}</span>
                                </div>
                            )}
                            <button disabled={otp.trim() === ''} type='submit' className='fp-button'>{otpLoading ? <PulseLoader size={10} margin={4} /> : "Confirm"}</button>
                        </form>
                    </div>
                ) : (
                    <div className='fp-content-box'>
                        <picture className='fp-image-container'>
                            <Image className='fp-image' src="/forgot_password.jpg" width={100} height={90} priority alt="forgot-password-image" />
                        </picture>

                        <h1 className='fp-forgot-title'>Forgot password ?</h1>

                        <p className='fp-forgot-text'>Enter your email and we will send you a otp to reset your password</p>

                        <form className='fp-email-form' onSubmit={(e) => { handleEmailSubmit(e); }}>
                            <input type='email' placeholder='Enter your email' className='fp-input' value={email} onChange={(e) => { handleEmailChange(e.target.value); }} required />
                            {emailError !== '' && (
                                <div className='fp-error'>
                                    <span className="fp-error-icon"><MdError /></span>
                                    <span className="fp-error-text">{emailError}</span>
                                </div>
                            )}
                            <button disabled={email.trim() === ''} type='submit' className='fp-button'>{emailLoading ? <PulseLoader size={10} margin={4} /> : "Confirm"}</button>
                        </form>
                    </div>
                )}
            </>
            }
        </main>
    )
}

export default ForgotPassword
