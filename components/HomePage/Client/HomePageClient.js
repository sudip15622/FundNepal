"use client"
import React from 'react'
import "./HomePageClient.css";
import Image from 'next/image';
import Link from 'next/link';

import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { FaCheck } from "react-icons/fa6";

const HomePageClient = () => {
  return (
    <main className='homepage-container'>
      <picture>
        <Image className='homepage-cover' src="/bg_removed.png" width={600} height={400} alt="fundnepal cover" />
      </picture>

      <div className="homepage-first-content">
        <div className="homepage-title-small">FundNepal for Nepalese</div>
        <h1 className="homepage-title-big">Connecting Hearts, Changing Lifes</h1>
        <Link href={"getstarted"} className='get-started-btn'>
          <span>Get Started</span>
        </Link>
      </div>

      <div className="homepage-second">
        helo
      </div>
    </main>
  )
}

export default HomePageClient
