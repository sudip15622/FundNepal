"use client"
import React, { useEffect, useState, useRef } from 'react'
import { useSession } from "next-auth/react";
import "./Profile.css"
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PulseLoader, MoonLoader } from 'react-spinners'
import { isValidName, isValidEmail, isValidPhone, isValidUserName } from '@/utils/validateFundraiser'
import { isValidAvatar } from '@/utils/validateUrl';
import { updateUser, getUserProfile, handleUserPassword } from '@/actions/handleRegister'

import { FaCheckCircle, FaRegEdit } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { BiSolidError } from "react-icons/bi";
import { BiSolidShow, BiSolidHide } from "react-icons/bi";


const Profile = ({ userId }) => {

    const { data: session, update } = useSession();
    const router = useRouter();

    const [user, setUser] = useState(null);
    const [editContent, setEditContent] = useState(null);
    const [nowEditing, setNowEditing] = useState(false);
    const [animatePopup, setAnimatePopup] = useState(false);
    const [editError, setEditError] = useState("");
    const [saveLoading, setSaveLoading] = useState(false);
    const [editInfo, setEditInfo] = useState("");
    const [loading, setLoading] = useState(true);

    const [showPassword, setShowPassword] = useState('');
    const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });
    const [passwordError, setPasswordError] = useState("");
    const [passwordInfo, setPasswordInfo] = useState("");
    const [passwordLoading, setPasswordLoading] = useState(false);

    const popupRef = useRef(null);

    const getuser = async () => {
        const details = await getUserProfile(userId);
        if (details?.success) {
            setUser(details?.user);
            // console.log(details.user)
        }
        setLoading(false);
    }

    useEffect(() => {
        getuser();
    }, [nowEditing]);


    useEffect(() => {
        function handleClickOutside(event) {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                handleHideClick();
            }
        }
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };

    }, [nowEditing]);

    const getDate = (date) => {
        const formattedDate = new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        return formattedDate;
    }

    const hanldeEditBtnClick = (content) => {
        setAnimatePopup(false);
        setEditContent(content);
        setNowEditing(true);
    }

    const handleHideClick = () => {
        setAnimatePopup(true);
        setTimeout(() => {
            setEditError("");
            setNowEditing(false);
            setEditContent(null);
            setAnimatePopup(false);
        }, 200);
    }

    const handleInputChange = (key, value) => {
        if (key !== 'avatar') {
            const validation = validateFunctions[key](value);
            if (!validation.success) {
                setEditError(validation.error);
            } else {
                setEditError("");
            }
        }
        setEditContent({ ...editContent, value: value });
    }

    const validateFunctions = {
        name: isValidName,
        email: isValidEmail,
        phone: isValidPhone,
        avatar: isValidAvatar,
        userName: isValidUserName,
    }

    const updateSession = async (data) => {
        await update({
            ...session,
            user: {
                ...session?.user,
                ...data
            }
        });
        router.refresh();
    }

    const handleSaveClick = async () => {
        if (saveLoading) return;

        setEditInfo("");
        setSaveLoading(true);

        if (!editContent.value) {
            setEditError("This field cannot be empty");
            setSaveLoading(false);
            return;
        }

        let validation;

        if (editContent.key === 'avatar') {
            validation = await isValidAvatar(editContent.value);
        } else {
            validation = validateFunctions[editContent.key](editContent.value);
        }
        if (!validation.success || validation.error) {
            setEditError(validation.error);
            setSaveLoading(false);
            return;
        }

        const data = {
            [editContent.key]: editContent.value
        }

        const response = await updateUser(user.id, data);
        if (!response.success || response.error) {
            setEditError(response.error);
            setSaveLoading(false);
            return;
        }
        if (response.nextError) {
            setEditError(response.nextError);
            setSaveLoading(false);
            return;
        }

        setEditInfo("Changes saved successfully!");

        // Update session
        const contents = ['name', 'email', 'userName', 'avatar'];
        if (contents.includes(editContent.key)) {
            await updateSession(data);
        }

        setTimeout(() => {
            setEditInfo("");
            setSaveLoading(false);
            handleHideClick();
        }, 2000);

    }

    const handleHideShow = (type) => {
        if (showPassword === type) {
            setShowPassword('');
        } else {
            setShowPassword(type);
        }
    }

    const handlePasswordChange = (key, value) => {
        setPasswords({ ...passwords, [key]: value });
    }

    const handlePasswordSave = async (e) => {
        if (passwordLoading) return;

        setPasswordError("");
        setPasswordInfo("");
        setPasswordLoading(true);

        if (!passwords.currentPassword || !passwords.newPassword) {
            setPasswordError("Both fields are required!");
            setPasswordLoading(false);
            resetPasswordErrorInfo();
            return;
        }

        if (passwords.currentPassword === passwords.newPassword) {
            setPasswordError("New password cannot be the same as the current password!");
            setPasswordLoading(false);
            resetPasswordErrorInfo();
            return;
        }

        const data = {
            currentPassword: passwords.currentPassword,
            newPassword: passwords.newPassword,
        }

        const response = await handleUserPassword(user.id, data);
        if (!response.success || response.error) {
            setPasswordError(response.error);
            setPasswordLoading(false);
            resetPasswordErrorInfo();
            return;
        }
        if (response.nextError) {
            setPasswordError(response.nextError);
            setPasswordLoading(false);
            resetPasswordErrorInfo();
            return;
        }

        setPasswordInfo("Password changed successfully!");

        setTimeout(() => {
            setPasswords({ currentPassword: "", newPassword: "" });
            setPasswordError("");
            setPasswordInfo("");
            setPasswordLoading(false);
            router.refresh();
        }, 2000);
    }

    const resetPasswordErrorInfo = () => {
        setTimeout(() => {
            setPasswordError("");
            setPasswordInfo("");
        }, 4000);
    }

    return (
        <div className='up-profile-container'>
            <div className="up-profile-header">
                <h1 className="up-profile-title">Your Profile</h1>
                <p className="up-profile-text">This is your profile on FundNepal. Here you can manage your details.</p>
            </div>

            {loading ? (
                <div className="up-loading">
                    <MoonLoader size={100} color='var(--btn-secondary)' />
                </div>
            ) : (
                user && (
                    <>
                        <div className="up-profile-content">
                            <div className="up-profile-content-top">
                                <picture className='up-profile-avatar'>
                                    <Image className='up-profile-avatar-image' src={user.avatar !== "" ? user.avatar : "/user.png"} width={200} height={190} priority alt="user-avatar" />
                                    <button className="up-profile-edit-btn up-edit-avatar" onClick={(e) => { hanldeEditBtnClick({ key: 'avatar', value: user.avatar, type: 'text', span: 'Avatar Url' }); }}><FaRegEdit /></button>
                                </picture>
                                <div className="up-profile-name-role">
                                    <div className="up-profile-name-cont">
                                        <h2 className="up-profile-name">{user.name}</h2>
                                        <button className="up-profile-edit-btn" onClick={(e) => { hanldeEditBtnClick({ key: 'name', value: user.name, type: 'text', span: 'Full Name' }); }}><FaRegEdit /></button>
                                    </div>
                                    <p className="up-profile-role">{user.role}</p>
                                    <p className="up-profile-date">Joined on {getDate(user.dateJoined)}</p>
                                </div>
                            </div>
                            <div className="up-profile-content-bottom">
                                <div className="up-profile-content-container">
                                    <div className="up-profile-content-high">
                                        <div className="up-profile-content-title">Username</div>
                                        <button className="up-profile-edit-btn" onClick={(e) => { hanldeEditBtnClick({ key: 'userName', value: user.userName, type: 'text', span: 'Username' }); }}><FaRegEdit /></button>
                                    </div>
                                    <div className="up-profile-content-low">
                                        <div className="up-profile-content-text">{user.userName}</div>
                                    </div>
                                </div>
                                <div className="up-profile-content-container">
                                    <div className="up-profile-content-high">
                                        <div className="up-profile-content-title">Email</div>
                                        <button className="up-profile-edit-btn" onClick={(e) => { hanldeEditBtnClick({ key: 'email', value: user.email, type: 'text', span: 'Email' }); }}><FaRegEdit /></button>
                                    </div>
                                    <div className="up-profile-content-low">
                                        <div className="up-profile-content-text">{user.email}</div>
                                    </div>
                                </div>
                                <div className="up-profile-content-container">
                                    <div className="up-profile-content-high">
                                        <div className="up-profile-content-title">Phone</div>
                                        <button className="up-profile-edit-btn" onClick={(e) => { hanldeEditBtnClick({ key: 'phone', value: user.phone, type: 'number', span: 'Phone' }); }}><FaRegEdit /></button>
                                    </div>
                                    <div className="up-profile-content-low">
                                        <div className="up-profile-content-text">{user.phone ? user.phone : "Not Set"}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="up-profile-password-content">
                                <div className="up-password-content-header">
                                    <h2 className="up-profile-pp-title">Change Password</h2>
                                    <p className="up-profile-pp-text">You can change your password here.</p>
                                </div>

                                <div className="up-password-content-body">
                                    <div className="fs-inputBox up-inputBox-password">
                                        <input type={showPassword === "current" ? "text" : "password"} className={`${passwords.currentPassword !== "" && "fs-valid"}`} name='currentPassword' value={passwords.currentPassword} onChange={(e) => { handlePasswordChange('currentPassword', e.target.value); }} required />
                                        <span>Current Password</span>
                                        <button onClick={(e) => { handleHideShow('current'); }} className='up-password-show-hide' type="button">{showPassword === "current" ? <BiSolidShow /> : <BiSolidHide />}</button>
                                    </div>
                                    <div className="fs-inputBox up-inputBox-password">
                                        <input type={showPassword === "new" ? "text" : "password"} className={`${passwords.newPassword !== "" && "fs-valid"}`} name='newPassword' value={passwords.newPassword} onChange={(e) => { handlePasswordChange('newPassword', e.target.value); }} required />
                                        <span>New Password</span>
                                        <button onClick={(e) => { handleHideShow('new'); }} className='up-password-show-hide' type="button">{showPassword === "new" ? <BiSolidShow /> : <BiSolidHide />}</button>
                                    </div>
                                    <button onClick={(e) => { handlePasswordSave(); }} disabled={passwordLoading || passwordError || passwords.currentPassword.trim() === "" || passwords.currentPassword.trim() === ""} className="up-edit-save-btn up-save-pw-btn">{passwordLoading ? <PulseLoader size={10} margin={4} color='var(--text-light)' /> : "Change Password"}</button>
                                </div>
                                {passwordError != "" && <div className="fs-title-error up-password-error">
                                    <BiSolidError /> {passwordError}
                                </div>}
                                {passwordInfo != "" && <div className="fs-title-info up-password-error">
                                    <FaCheckCircle /> {passwordInfo}
                                </div>}
                                <div className="fs-title-info up-password-error up-password-tips">
                                    <i><b>Note:</b> Password must be of at least 8 character, including at least one uppercase letter, lowercase letter, special character and digit.</i>
                                </div>
                            </div>
                        </div>

                        {nowEditing && (
                            <div className={`up-edit-container-overlay ${animatePopup && "up-overlay-hide"}`}>
                                {editContent && (
                                    <div ref={popupRef} className={`up-edit-container ${animatePopup && "up-popup-hide"}`}>
                                        <button className="up-hide-popup-btn" onClick={(e) => { handleHideClick(); }}><IoClose /></button>
                                        <h2 className="up-edit-container-title">Change {editContent.span}</h2>
                                        <div className="fs-inputBox up-inputBox">
                                            <input type={editContent.type} className={`${editContent.value !== "" && "fs-valid"}`} name={editContent.key} value={editContent.value} onChange={(e) => { handleInputChange(editContent.key, e.target.value); }} required />
                                            <span>{editContent.span}</span>
                                        </div>
                                        {editError != "" && <div className="fs-title-error up-edit-error">
                                            <BiSolidError /> {editError}
                                        </div>}
                                        {editInfo != "" && <div className="fs-title-info up-edit-error">
                                            <FaCheckCircle /> {editInfo}
                                        </div>}
                                        <button disabled={editError || editInfo || !editContent.value || saveLoading} type='button' className="up-edit-save-btn" onClick={(e) => { handleSaveClick(); }}>{saveLoading ? <PulseLoader size={10} margin={4} color='var(--text-light)' /> : "Save"}</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )
            )}
        </div>
    )
}

export default Profile
