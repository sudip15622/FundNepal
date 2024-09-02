"use client"
import React from 'react'
import "./HomePageClient.css";
import Image from 'next/image';

import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { FaCheck } from "react-icons/fa6";

const HomePageClient = () => {
  return (
    <main className='homepage-container'>
      <div className="homepage-first">
        <div className="first-left">
          <div className="left-top">
            <div className="title-small">Leading Crowdfunding Platform</div>
            <h1 className="title-big">FundNepal: Connecting Hearts, Changing Lifes</h1>
          </div>
          <div className="left-bottom">
            <div className="description-cont">
              <div className="desc-title">You are one step away to help those who are needing funds.</div>
              <ul className="desc-item-cont">
                <li className="desc-item">
                  <div className="desc-icon"><FaCheck /></div>
                  <div className="desc-text">Browse various fundraisers by categories.</div>
                </li>
                <li className="desc-item">
                  <div className="desc-icon"><FaCheck /></div>
                  <div className="desc-text">Help people by donations and share.</div>
                </li>
                <li className="desc-item">
                  <div className="desc-icon"><FaCheck /></div>
                  <div className="desc-text">Start fundraise for yourself, family & friends.</div>
                </li>
              </ul>
            </div>
            <button className='get-started-btn'>
              <span>Get Started</span>
            </button>
          </div>
        </div>
        <div className="first-right">
          <Image className='home-cover' src="/home_cover3.jpg" width={600} height={400} alt="fundnepal cover" />
        </div>
      </div>
    </main>
  )
}

export default HomePageClient
