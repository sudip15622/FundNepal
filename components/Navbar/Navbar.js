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
            <ul className="f navbar-left">
                <li>
                    <Link href={"/"} className="f logo-wrapper" >
                        <Image src="/logo.png" width={50} height={50} priority alt="logo" />
                        <div className="f logo-text">FUND NEPAL</div>
                    </Link>
                </li>
                <li>
                    <Link href={"/search"} className={`f search-wrapper ${(pathname == 'search') && 'active-page'}`}>
                        <div className="f search-icon"><IoSearch /></div>
                        <div className="f search-text">Search</div>
                    </Link>
                </li>
            </ul>
            <ul className="f navbar-right">
                <li>
                    <Link href={"donate"} className={`f navbar-pages ${(pathname == 'donate') && 'active-page'}`}>
                        DONATE
                    </Link>
                </li>
                <li>
                    <Link href={"fundraise"} className={`f navbar-pages ${(pathname == 'fundraise') && 'active-page'}`}>
                        FUNDRAISE
                    </Link>
                </li>
                <li>
                    <Link href={"about-us"} className={`f navbar-pages ${(pathname == 'about-us') && 'active-page'}`}>
                        ABOUT US
                    </Link>
                </li>
                <li className='f pages-btn-container'>
                    <Link href={"sign-in"} className={`f navbar-pages-btn signin-btn ${(pathname == 'sign-in') && 'active-page'}`}>
                        Sign In
                    </Link>
                    <Link href={"register"} className={`f navbar-pages-btn signup-btn ${(pathname == 'register') && 'active-page'}`}>
                        Sign Up
                    </Link>
                </li>
            </ul>
        </div>
    )
}

export default Navbar
