"use client"
import React, { useEffect } from 'react'
import "./Footer.css";
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

import { FaPhoneSquareAlt, FaMailBulk } from "react-icons/fa";
import { FaPhoneVolume, FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa6";
import { RiFacebookFill } from "react-icons/ri";


const Footer = () => {

  const pathname = usePathname();

  useEffect(() => {
    console.log(pathname);
  }, [pathname])


  const pages = [
    {
      name: "Donate",
      link: "/donate",
    },
    {
      name: "Fundraise",
      link: "/fundraise",
    },
    {
      name: "Get started",
      link: "/getstarted",
    },
  ]
  return (
    (pathname !== "/getstarted" && pathname !== "/dashboard") && (
      <div className='footer-container'>
        <footer className="footer-container-inner">
          <div className="footer-top-container">
            <div className="footer-top-first">
              <h3 className="footer-top-title">More on FundNepal <span></span></h3>
              <ul className="footer-top-lists">
                {/* <li className="footer-top-listitems">
                  <Link href={"/"}>
                    About Us
                  </Link>
                </li> */}
                <li className="footer-top-listitems">
                  <Link href={"/"}>
                    Privacy Policy
                  </Link>
                </li>
                <li className="footer-top-listitems">
                  <Link href={"/"}>
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>
            <div className="footer-top-first footer-top-second">
              <h3 className="footer-top-title">FundNepal <span></span></h3>
              <ul className="footer-top-lists">
                <li className="footer-top-listitems">
                  <Link href={"/donate"}>
                    Donate
                  </Link>
                </li>
                <li className="footer-top-listitems">
                  <Link href={"/fundraise"}>
                    Fundraise
                  </Link>
                </li>
                <li className="footer-top-listitems">
                  <Link href={"/getstarted"}>
                    Get started
                  </Link>
                </li>
              </ul>
            </div>
            <div className="footer-top-third">
              <div className="footer-contact-field">
                <div className="footer-icon-cont"><FaPhoneVolume />
                </div>
                <div className="footer-details-cont">
                  <h3 className="footer-details-title">Contact</h3>
                  <p className="footer-details-text">9821253635 | 9769756048</p>
                </div>
              </div>
              <div className="footer-contact-field">
                <div className="footer-icon-cont"><FaMailBulk />
                </div>
                <div className="footer-details-cont">
                  <h3 className="footer-details-title">Email</h3>
                  <Link href={"mailto: fundnepal@gmail.com"} className="footer-details-text">fundnepal@gmail.com</Link>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-separator"></div>

          <div className="footer-bottom-container">
            <Link href={"/"} className="footer-bottom-first" >
              <picture>
                <Image className='footer-logo-image' src="/logo5.png" width={150} height={100} priority alt="logo" />
              </picture>
              <div className="footer-logo-text">FundNepal</div>
            </Link>
            <p className="footer-bottom-second">
              Copyright &copy; | www.fundnepal.com - 2024 | All Rights Reserved
            </p>
            <ul className="footer-bottom-third">
              <li className="footer-media">
                <Link href={"/"}>
                  <RiFacebookFill />
                </Link>
              </li>
              <li className="footer-media">
                <Link href={"/"}>
                  <FaInstagram />
                </Link>
              </li>
              <li className="footer-media">
                <Link href={"/"}>
                  <FaWhatsapp />
                </Link>
              </li>
            </ul>
          </div>
        </footer>
      </div>
    )
  )
}

export default Footer
