"use client"
import React, { useState, useEffect } from 'react'
import "./Navbar.css";
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { IoSearch } from "react-icons/io5";

const Navbar = () => {

    const pathname = usePathname().slice(1);

    return (
        <div className='navbar-container'>
            <ul className="navbar-left">
                <li>
                    <Link href={"/"} className="logo-wrapper" >
                        <Image src="/logo.png" width={50} height={50} priority alt="logo" />
                        <div className="logo-text">FUND NEPAL</div>
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
                <li className='pages-btn-container'>
                    <Link href={"sign-in"} className={`navbar-pages-btn signin-btn`}>
                        <span>Sign In</span>
                    </Link>
                    <Link href={"register"} className={`navbar-pages-btn signup-btn`}>
                        <span>Sign Up</span>
                    </Link>
                </li>
            </ul>
        </div>
    )
}

export default Navbar
