"use client"
import React, { useState, useEffect } from 'react'
import "./Navbar.css";
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { IoSearch } from "react-icons/io5";
import { FaUserCircle, FaChevronDown } from "react-icons/fa";

const Navbar = ({ session }) => {

    const pathname = usePathname().slice(1);

    const [user, setUser] = useState(null);

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


    return (
        <div className='navbar-container'>
            <ul className="navbar-left">
                <li>
                    <Link href={"/"} className="logo-wrapper" >
                        <Image className='logo-image' src="/logo5.png" width={150} height={100} priority alt="logo" />
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
                    <Link href={"donate"} className={`navbar-pages`}>
                        DONATE
                    </Link>
                </li>
                <li>
                    <Link href={"fundraise"} className={`navbar-pages`}>
                        FUNDRAISE
                    </Link>
                </li>
                <li>
                    <Link href={"about-us"} className={`navbar-pages`}>
                        ABOUT US
                    </Link>
                </li>
                {user ? <li className="username-container">
                    <div className="username-cont">
                        <div className="username-cont-left">
                            <div className="user-avatar"><FaUserCircle /></div>
                            <div className="username-text">{user.userName}</div>
                        </div>
                        <div className="username-cont-right"><FaChevronDown /></div>
                    </div>
                    {/* <div className="user-page-lists">
                        <Link href={"/dashboard"} className="user-page"></Link>
                        <div className="user-page">Sign Out</div>
                    </div> */}
                </li> :
                    <li className='pages-btn-container'>
                        <Link href={"sign-in"} className={`navbar-pages-btn signin-btn`}>
                            <span>Sign In</span>
                        </Link>
                        <Link href={"register"} className={`navbar-pages-btn signup-btn`}>
                            <span>Sign Up</span>
                        </Link>
                    </li>}

            </ul>
        </div>
    )
}

export default Navbar
