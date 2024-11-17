"use client"
import React, { useState, useEffect, useRef } from 'react'
import "./Navbar.css";
import Image from 'next/image';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

import { IoSearch } from "react-icons/io5";
import { FaUserCircle, FaChevronDown, FaChevronUp, FaSignOutAlt } from "react-icons/fa";

const Navbar = ({ session }) => {

    const [user, setUser] = useState(null);
    const [showDropDown, setShowDropDown] = useState(false);
    const dropDownRef = useRef(null);

    useEffect(() => {
        if (session?.user?.id) {
            fetch(`/api/user?id=${session.user.id}`)
                .then((response) => response.json())
                .then((data) => {
                    if (data && !data.error) {
                        setUser(data);
                    }
                })
                .catch((error) => console.error('Error fetching user data:', error));
        }
    }, [session]);

    useEffect(() => {

        function handleClickOutside(event) {
            if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
                setShowDropDown(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };

    }, [showDropDown]);

    const handleSignOut = async () => {
        await signOut();
    }

    return (
        <nav className="navbar-container-wrapper">
            <div className='navbar-container'>
                <ul className="navbar-left">
                    <li>
                        <Link href={"/"} className="logo-wrapper" >
                            <picture>
                                <Image className='logo-image' src="/logo5.png" width={150} height={100} priority alt="logo" />
                            </picture>
                            <div className="logo-text">FundNepal</div>
                        </Link>
                    </li>
                    <li>
                        <Link href={"/search"} className={`search-wrapper`}>
                            <div className="search-icon"><IoSearch /></div>
                            <div className="search-text">Search</div>
                        </Link>
                    </li>
                </ul>
                <ul className="navbar-right">
                    <li>
                        <Link href={"/donate"} className={`navbar-pages`}>
                            DONATE
                        </Link>
                    </li>
                    <li>
                        <Link href={"/fundraise"} className={`navbar-pages`}>
                            FUNDRAISE
                        </Link>
                    </li>
                    {/* <li>
                        <Link href={"/about-us"} className={`navbar-pages`}>
                            ABOUT US
                        </Link>
                    </li> */}
                    {session ? <li className="username-cont" ref={dropDownRef}>
                        <div className="username-cont-left" onClick={(e) => { setShowDropDown(!showDropDown) }}>
                            <div className="user-avatar"><FaUserCircle /></div>
                            <div className="username-text">
                                {session.user.userName.length < 10 ? <span>{session.user.userName}</span> : <span>{`${session.user.userName.slice(0, 8)}...`}</span>}
                            </div>
                            <div className={`username-cont-right ${showDropDown && "rotate-updown"}`}><FaChevronDown /></div>
                        </div>
                        <div className={`user-page-lists ${showDropDown && "show-transition"}`}>
                            <Link href={"/dashboard"} className="user-page dashboard-btn">Dashboard</Link>
                            <div className="user-page sign-out-btn">
                                <div className="sign-out-icon"><FaSignOutAlt /></div>
                                <div className="sign-out-text" onClick={(e) => { handleSignOut(); }}>Sign Out</div>
                            </div>
                        </div>
                    </li> :
                        <li className='pages-btn-container'>
                            <Link href={"/signin"} className={`navbar-pages-btn signin-btn`}>
                                <span>Sign In</span>
                            </Link>
                            <Link href={"/register"} className={`navbar-pages-btn signup-btn`}>
                                <span>Sign Up</span>
                            </Link>
                        </li>}

                </ul>
            </div>
        </nav>
    )
}

export default Navbar
