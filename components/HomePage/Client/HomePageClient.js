"use client"
import React, { useState, useEffect, useRef } from 'react'
import "./HomePageClient.css";
import Image from 'next/image';
import Link from 'next/link';

import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { FaCheck } from "react-icons/fa6";

const HomePageClient = () => {

  const [text, setText] = useState('');
  const fullText = "Connecting Hearts, Changing Lives";
  const typingSpeed = 100;
  const indexRef = useRef(0);

  useEffect(() => {
    const typeText = () => {
      const currentIndex = indexRef.current;
      if (currentIndex < fullText.length) {
        setText((prev) => prev + fullText.charAt(currentIndex));
        indexRef.current++;
        setTimeout(typeText, typingSpeed);
      }
    };
    setTimeout(typeText, typingSpeed);

    const handleScroll = () => {
      const overlay = document.getElementById("overlay");
      const scrollPosition = window.scrollY;
      const maxScroll = 300;

      const opacity = Math.min(scrollPosition / maxScroll, 0.5);
      if (overlay) {
        overlay.style.backgroundColor = `rgba(0, 0, 0, ${opacity})`;
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);


  return (
    <main className='homepage-container'>
      <picture>
        <Image className='hp-homepage-cover' src="/bg_removed.png" width={600} height={400} alt="fundnepal cover" />
        <div className="black-overlay" id="overlay"></div>
      </picture>

      <div className="hp-homepage-first-content">
        <div className="hp-homepage-title-small">FundNepal for Nepalese</div>
        <h1 className="hp-homepage-title-big">
          {text}
          <span className="cursor-block">|</span>
        </h1>
        <Link href={"getstarted"} className='hp-get-started-btn'>
          <span>Get Started</span>
        </Link>
      </div>

      <div className="hp-homepage-second">
        helo
      </div>
    </main>
  )
}

export default HomePageClient
