"use client"
import React, { useState, useEffect, act } from 'react';
import "./Overview.css";
import { MoonLoader } from 'react-spinners';
import Image from 'next/image';
import Link from 'next/link';
import { getDonationByFundraiserId, getAllDonationsByFundraiserId } from '@/actions/getDonations';

import { MdCampaign, MdReport } from "react-icons/md";
import { BiSolidDonateHeart, BiDonateHeart } from "react-icons/bi";
import { GoCopy } from "react-icons/go";
import { FaChevronCircleLeft, FaChevronCircleRight, FaUsers } from "react-icons/fa";
import { GoGoal } from "react-icons/go";

const Overview = ({ user, overview, allFundraisers }) => {

    // const [activeFundraiser, setActiveFundraiser] = useState(null);
    // const [activeIndex, setActiveIndex] = useState(0);
    // const [activeLoading, setActiveLoading] = useState(true);
    // const [donationOverview, setDonationOverview] = useState([]);
    // const [hello, setHello] = useState(null);
    // const [allDonations, setAllDonations] = useState([]);
    // const [shareInfo, setShareInfo] = useState('');

    // const getDonationOverview = async (fundraiserId) => {
    //     const donationOverview = await getDonationByFundraiserId(fundraiserId);
    //     const overviewList = [donationOverview.recentDonation, donationOverview.topDonation, donationOverview.firstDonation];

    //     const hello = { totalDonations: donationOverview.totalDonationCount, totalRecentDonations: donationOverview.totalRecentDonationCount };
    //     setDonationOverview(overviewList);
    //     setHello(hello);
    // }

    // const getAllDonations = async (fundraiserId) => {
    //     const donations = await getAllDonationsByFundraiserId(fundraiserId);
    //     console.log(donations);
    //     setAllDonations(donations);
    // }

    // const donorTypes = ["Recent donor", "Top donor", "First donor"];

    // useEffect(() => {
    //     // setActiveLoading(true);
    //     if (allFundraisers.length > 0) {
    //         const active = allFundraisers[activeIndex];
    //         setActiveFundraiser(active);
    //         getDonationOverview(active.id);
    //         getAllDonations(active.id);
    //     }
    //     setTimeout(() => {
    //         setActiveLoading(false);
    //     }, 800);
    // }, [allFundraisers, activeIndex])

    // const getImageUrl = (myfile) => {
    //     if (myfile) {
    //         const imageUrl = `data:${myfile.fileContentType};base64,${myfile.fileData}`;
    //         return imageUrl;
    //     }
    // }

    // const getAngle = (progress) => {
    //     return Math.min(100, Math.max(0, progress)) * 3.6;
    // }

    // const timesAgo = (date) => {
    //     try {
    //         const now = new Date();
    //         const seconds = Math.floor((now - new Date(date)) / 1000);

    //         let interval = Math.floor(seconds / 31536000); // seconds in a year
    //         if (interval >= 1) return interval + (interval === 1 ? " year ago" : " years ago");

    //         interval = Math.floor(seconds / 2592000); // seconds in a month
    //         if (interval >= 1) return interval + (interval === 1 ? " month ago" : " months ago");

    //         interval = Math.floor(seconds / 86400); // seconds in a day
    //         if (interval >= 1) return interval + (interval === 1 ? " day ago" : " days ago");

    //         interval = Math.floor(seconds / 3600); // seconds in an hour
    //         if (interval >= 1) return interval + (interval === 1 ? " hour ago" : " hours ago");

    //         interval = Math.floor(seconds / 60); // seconds in a minute
    //         if (interval >= 1) return interval + (interval === 1 ? " minute ago" : " minutes ago");

    //         return seconds + (seconds === 1 ? " second ago" : " seconds ago");
    //     } catch (error) {
    //         return (' ');
    //     }

    // }

    // const handleShare = async () => {
    //     try {
    //         const url = activeFundraiser ? `http://localhost:3000/fundraiser/${activeFundraiser.slug}` : '';

    //         await navigator.clipboard.writeText(url);

    //         setShareInfo('URL copied to clipboard!');
    //         setTimeout(() => {
    //             setShareInfo('');
    //         }, 2000);
    //     } catch (err) {
    //         setShareInfo('Failed to copy URL!');
    //         setTimeout(() => {
    //             setShareInfo('');
    //         }, 2000);
    //     }
    // };

    // const handlePrevNext = (btn) => {
    //     if (btn === 'prev') {
    //         if (activeIndex <= 0) {
    //             setActiveIndex(allFundraisers.length - 1);
    //         } else {
    //             setActiveIndex(activeIndex - 1);
    //         }
    //     }
    //     if (btn === 'next') {
    //         if (activeIndex >= allFundraisers.length - 1) {
    //             setActiveIndex(0);
    //         } else {
    //             setActiveIndex(activeIndex + 1);
    //         }
    //     }
    // }

    return (
        <>
            <div className="ad-overview-container">
                <div className="ad-overview-header">
                    <h1 className="ad-overview-title">Welcome, {user.name}</h1>
                    <p className="ad-overview-text">Where insights meet action — empowering your journey.</p>
                </div>
                <ul className="ad-overview-cards-container">
                    <li className="ad-overview-card">
                        <div className="ad-overview-card-details">
                            <span className="ad-overview-card-title">Total Users <FaUsers style={{ fontSize: "1.6rem" }} /></span>
                            <span className="ad-overview-card-text">Number of users now in FundNepal.</span>
                        </div>
                        <div className="ad-overview-card-count"><span>{overview.totalUsers}</span></div>
                    </li>
                    <li className="ad-overview-card">
                        <div className="ad-overview-card-details">
                            <span className="ad-overview-card-title">Total Fundraisers <MdCampaign style={{ fontSize: "1.6rem" }} /></span>
                            <span className="ad-overview-card-text">Number of fundraisers that are created here.</span>
                        </div>
                        <div className="ad-overview-card-count"><span>{overview.totalFundraisers}</span></div>
                    </li>
                    <li className="ad-overview-card">
                        <div className="ad-overview-card-details">
                            <span className="ad-overview-card-title">Total Donations <BiSolidDonateHeart style={{ fontSize: "1.6rem" }} /></span>
                            <span className="ad-overview-card-text">Number of donations that are made here.</span>
                        </div>
                        <div className="ad-overview-card-count"><span>{overview.totalDonations}</span></div>
                    </li>
                    <li className="ad-overview-card">
                        <div className="ad-overview-card-details">
                            <span className="ad-overview-card-title">Total Reports <MdReport style={{ fontSize: "1.6rem" }} /></span>
                            <span className="ad-overview-card-text">Number of reports that are actioned here.</span>
                        </div>
                        <div className="ad-overview-card-count"><span>0</span></div>
                    </li>
                </ul>

                {/* <div className="ad-overview-active">
                    <div className="ad-overview-active-header">
                        <h2 className="ad-overview-active-title">Active Fundraisers Overview</h2>
                        {(activeFundraiser && allFundraisers.length > 1) && <div className="ad-overview-active-buttons">
                            <button type="button" className='ad-prev-next-btn' onClick={(e) => { handlePrevNext('prev') }}><FaChevronCircleLeft /></button>
                            <button type="button" className='ad-prev-next-btn' onClick={(e) => { handlePrevNext('next') }}><FaChevronCircleRight /></button>
                        </div>}
                    </div>
                    {activeLoading ? <div className="ad-loading">
                        <MoonLoader size={100} color='var(--btn-secondary)' />
                    </div> : (
                        activeFundraiser ? <div className="ad-overview-active-content">
                            <div className="ad-fundraiser-detials">
                                <picture className="ad-details-left">
                                    <Image className='ad-details-left-image' src={getImageUrl(activeFundraiser.photo)} width={300} height={200} priority alt="fundraiser-cover-image" />
                                </picture>
                                <div className="ad-details-right">
                                    <Link href={`/fundraisers/${activeFundraiser.slug}`} className="ad-fundraiser-title">{activeFundraiser.title}</Link>
                                    <p className="ad-fundraiser-text">{activeFundraiser.description.slice(0, 150)}...</p>
                                </div>
                            </div>

                            <div className="ad-fundraiser-overview-container">
                                <div className="ad-fundraiser-progress">
                                    <div className="circle" style={{ '--progress': `${getAngle(activeFundraiser.progress)}deg` }} />
                                    <div className="innerCircle" />
                                    <div className="progressText">{activeFundraiser.progress}% <span>progress</span></div>
                                </div>
                                <div className="ad-fundraiser-goal-details">
                                    <span className="ad-fundraiser-goal-amount">Rs.{activeFundraiser.goal}</span>
                                    <span className='ad-fundraiser-goal-text'><GoGoal style={{fontSize: "1.4rem"}}/>Goal</span>
                                </div>
                                <div className="ad-fundraiser-donation-ac-card">
                                    <span className="ad-fundraiser-donation-ac-icon1">NRS</span>
                                    <span className="ad-fundraiser-donation-ac-text">{activeFundraiser.totalDonationAmount}</span>
                                    <span className="ad-fundraiser-donation-ac-title">Fund Raised Yet</span>
                                </div>
                                <div className="ad-fundraiser-donation-ac-card">
                                    <span className="ad-fundraiser-donation-ac-icon2"><BiSolidDonateHeart /></span>
                                    <span className="ad-fundraiser-donation-ac-text">{hello ? hello.totalDonations : "0"}</span>
                                    <span className="ad-fundraiser-donation-ac-title">Total Donations</span>
                                </div>
                            </div>

                            <div className="ad-fundraiser-donor-details">
                                <div className="ad-donor-overview">
                                    <h3 className="ad-donor-overview-title">Donation Overview</h3>
                                    {(donationOverview.length > 0 && donationOverview[0]) ? <ul className="ad-donor-overview-list">
                                        {donationOverview.map((donation, index) => {
                                            return (
                                                donation && <li key={index} className="ad-box-types-item">
                                                    <div className="ad-comments-item-icon"><BiDonateHeart /></div>
                                                    <div className="ad-types-item-details">
                                                        <div className="ad-types-item-name">{donation.user.name}</div>
                                                        <div className="ad-types-item-amount-type">
                                                            <span className="ad-types-item-amount">Rs{donation.donationAmount}</span>
                                                            <span className="ad-type-item-type">--- {donorTypes[index]}</span>
                                                        </div>
                                                    </div>
                                                </li>
                                            )
                                        })}
                                    </ul> : <div className="ad-overview-active-empty1">
                                        <button className="ad-details-sd-btn" onClick={(e) => { handleShare(''); }}>
                                            {shareInfo != '' && <span className="ad-sd-btn-info">{shareInfo}</span>}
                                            <div className="ad-details-sd-icon"><GoCopy /></div> Copy link
                                        </button>
                                        <span className="ad-no-dontaion-text">Share this fundraiser to reach donors.</span>
                                    </div>}
                                </div>
                                <div className="ad-donor-overview ad-all-donor-list-cont">
                                    <h3 className="ad-donor-overview-title">All Donations Details</h3>
                                    {allDonations.length > 0 ? <ul className="ad-donor-overview-list ad-all-donor-list">
                                        {allDonations.map((donation, index) => {
                                            return (
                                                donation && <li key={index} className="ad-box-types-item ad-all-donor-listitems">
                                                    <div className="ad-comments-item-icon"><BiDonateHeart /></div>
                                                    <div className="ad-types-item-details">
                                                        <div className="ad-types-item-name">{donation.user.name}</div>
                                                        <div className="ad-types-item-amount-type">
                                                            <span className="ad-types-item-amount">Rs{donation.donationAmount}</span>
                                                            <span className="ad-type-item-type">--- {timesAgo(donation.dateDonated)}</span>
                                                        </div>
                                                    </div>
                                                </li>
                                            )
                                        })}
                                    </ul> : <div className="ad-overview-active-empty2">
                                        <span className='ad-no-donation-title'>No donations yet!</span>
                                        <span className='ad-no-donation-text'>All the donations to this fundraiser will appear here.</span>
                                    </div>}
                                </div>
                            </div>

                        </div> : <div className="fs-fundraisers-empty">
                            <span className='fs-no-fundraisers-title'>No active fundraisers!</span>
                            <span className='fs-no-fundraisers-text'>Click the button below to create a fundraiser here.</span>
                            <Link href={"/getstarted"} className="ad-get-started-btn">
                                <span>Get Started</span>
                            </Link>
                        </div>
                    )}
                </div> */}
            </div>
        </>
    )
}

export default Overview
