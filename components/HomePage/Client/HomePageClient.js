"use client"
import React, { useState, useEffect, useRef } from 'react'
import "./HomePageClient.css";
import Image from 'next/image';
import Link from 'next/link';
import { getAllFundraisers } from '@/actions/getFundraisers';
import Skeleton from '@/components/Skeleton/Skeleton';

import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { FaCheck } from "react-icons/fa6";
import { FaChevronDown } from "react-icons/fa";
import { TbTargetArrow } from "react-icons/tb";
import { MdOutlineRocketLaunch } from "react-icons/md";
import { HiMiniBarsArrowUp } from "react-icons/hi2";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa6";

const HomePageClient = () => {

  const [text, setText] = useState('');
  const fullText = "Connecting Hearts, Changing Lives";
  const typingSpeed = 100;
  const indexRef = useRef(0);

  const [allFundraisers, setAllFundraisers] = useState([]);
  const [totalFundraisers, setTotalFundraisers] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('Now Trending');
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const filterRef = useRef(null);

  const fetchFundraisers = async () => {
    setLoading(true);
    try {
      const result = await getAllFundraisers(page, pageSize, filter);
      setAllFundraisers(result.fundraisers);
      setTotalFundraisers(result.totalFundraisers);
      console.log(result);
    } catch (error) {
      console.error('Error fetching fundraisers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFundraisers();
  }, [page, pageSize, filter]);

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

  useEffect(() => {

    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };

  }, [showFilters]);

  const getImageUrl = (myfile) => {
    if (myfile) {
      const imageUrl = `data:${myfile.fileContentType};base64,${myfile.fileData}`;
      return imageUrl;
    }
  }

  const getAddress = (contactInfo) => {
    if (contactInfo) {
      const wardNo = contactInfo[0].address.wardNo;
      const city = contactInfo[0].address.city;
      const district = contactInfo[0].address.district;
      return `${city}-${wardNo}, ${district}`;
    }
  }

  const handlePrevNext = (type) => {
    if (type === 'prev') {
      if (page > 1) {
        setPage(page - 1);
      }
    } else {
      const totalPages = Math.ceil(totalFundraisers / pageSize);
      if (page < totalPages) {
        setPage(page + 1);
      }
    }
  }


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
        <div className="hp-happening-worldwide">
          <h2 className="hp-happening-worldwide-title">Discover fundraisers inspired by what you care about</h2>
          <div className="hp-happening-worldwide-filters">
            <div className="hp-filter-container" ref={filterRef}>
              <div className="hp-main-filter" onClick={(e) => { setShowFilters(!showFilters) }}>
                <span className="hp-main-filter-text">{filter}</span>
                <span className="hp-main-filter-icon"><FaChevronDown /></span>
              </div>
              <ul className={`hp-filter-option-container ${showFilters && "hp-show-filters"}`}>
                <li className="hp-filter-option" onClick={(e) => { setFilter('Close to Goal'); setShowFilters(false); }}>
                  <span className="hp-filter-option-icon"><TbTargetArrow /></span>
                  <span className="hp-filter-option-text">Close to Goal</span>
                </li>
                <li className="hp-filter-option" onClick={(e) => { setFilter('Just Launched'); setShowFilters(false); }}>
                  <span className="hp-filter-option-icon"><MdOutlineRocketLaunch /></span>
                  <span className="hp-filter-option-text">Just Launched</span>
                </li>
                <li className="hp-filter-option" onClick={(e) => { setFilter('Now Trending'); setShowFilters(false); }}>
                  <span className="hp-filter-option-icon"><HiMiniBarsArrowUp /></span>
                  <span className="hp-filter-option-text">Now Trending</span>
                </li>
              </ul>
            </div>
            <div className="hp-page-change-buttons">
              <button onClick={(e) => { handlePrevNext('prev') }} disabled={page <= 1}><FaArrowLeft /></button>
              <button onClick={(e) => { handlePrevNext('next') }} disabled={page >= Math.ceil(totalFundraisers / pageSize)}><FaArrowRight /></button>
            </div>

          </div>
          {loading ? <Skeleton /> : (allFundraisers && <ul className="hp-happening-worldwide-lists">
            {allFundraisers.map((fundraiser, index) => {
              return (
                <li key={fundraiser.id} className={`hp-fundraiser-item ${index == 0 && "hp-first-item"}`}>
                  <Link href={`/fundraisers/${fundraiser.slug}`}>
                    <div className={`hp-fundraiser-image-cont ${index == 0 && "hp-first-item-image-cont"}`}>
                      <Image className='hp-fundraiser-cover-image' src={getImageUrl(fundraiser.photo)} width={200} height={150} priority alt={`medical-${fundraiser.id}-image`} />
                      <span className='hp-fundraiser-address'>{getAddress(fundraiser.beneficiary)}</span>
                    </div>
                    <div className="hp-fundraiser-details">
                      <h3 className="hp-fundraiser-title">{fundraiser.title}</h3>
                      <div className="hp-details-progress">
                        <div className="hp-details-progress-top">
                          <div className="hp-progress-bar" style={{ width: `${fundraiser.progress}%` }}></div>
                        </div>
                        <div className="hp-progress-amount">
                          Rs.{fundraiser.totalDonationAmount} raised
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>)}
        </div>

        <div className="hp-homepage-third">
          <div className="hp-third-inner">
            <h2 className="hp-third-inner-title">Fundraising on FundNepal is easy, powerful, and trusted.</h2>
            <p className="hp-third-inner-desc">Get what you need to help your fundraiser succeed on FundNepal, whether you&apos;re raising money for yourself, friends, family, or charity. With no fee to start, FundNepal is the Nepal&apos;s leading crowdfunding platform—from educational campaigns to medical emergencies and nonprofits. Whenever you need help, you can ask here.</p>
          </div>
        </div>

        <div className="hp-homepage-fourth">
          <h2 className="hp-happening-worldwide-title">Fundraise for anyone</h2>
          <ul className="hp-fourth-fundraise-list">
            <li className="hp-fourth-fundraise-listitem">
              <Link href={"/getstarted"}>
                <div className="hp-fundraise-listitem-left">
                  <h3 className="hp-listitem-left-title">Yourself</h3>
                  <p className="hp-listitem-left-desc">Funds are delivered to your bank account for your own use.</p>
                </div>
                <div className="hp-fundraise-listitem-right"><FaAngleRight /></div>
              </Link>
            </li>
            <li className="hp-fourth-seperator"></li>
            <li className="hp-fourth-fundraise-listitem">
              <Link href={"/getstarted"}>
                <div className="hp-fundraise-listitem-left">
                  <h3 className="hp-listitem-left-title">Friends & Family</h3>
                  <p className="hp-listitem-left-desc">You&apos;ll invite a beneficiary to receive funds or distribute them yourself.</p>
                </div>
                <div className="hp-fundraise-listitem-right"><FaAngleRight /></div>
              </Link>
            </li>
            <li className="hp-fourth-seperator"></li>
            <li className="hp-fourth-fundraise-listitem">
              <Link href={"/getstarted"}>
                <div className="hp-fundraise-listitem-left">
                  <h3 className="hp-listitem-left-title">Charity</h3>
                  <p className="hp-listitem-left-desc">Funds are delivered to your chosen nonprofit for you.</p>
                </div>
                <div className="hp-fundraise-listitem-right"><FaAngleRight /></div>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </main>
  )
}

export default HomePageClient
