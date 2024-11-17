"use client"
import React, { useState, useEffect, act } from 'react';
import "./Overview.css";
import { MoonLoader } from 'react-spinners';
import Image from 'next/image';
import Link from 'next/link';
import { getDonationByFundraiserId, getAllDonationsByFundraiserId } from '@/actions/getDonations';

import { MdCampaign } from "react-icons/md";
import { BiSolidDonateHeart, BiDonateHeart } from "react-icons/bi";
import { GoCopy } from "react-icons/go";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";
import { GoGoal } from "react-icons/go";

const Overview = ({ user, overview, allFundraisers }) => {

    const [activeFundraiser, setActiveFundraiser] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [activeLoading, setActiveLoading] = useState(true);
    const [donationOverview, setDonationOverview] = useState([]);
    const [hello, setHello] = useState(null);
    const [allDonations, setAllDonations] = useState([]);
    const [shareInfo, setShareInfo] = useState('');

    const getDonationOverview = async (fundraiserId) => {
        const donationOverview = await getDonationByFundraiserId(fundraiserId);
        const overviewList = [donationOverview.recentDonation, donationOverview.topDonation, donationOverview.firstDonation];

        const hello = { totalDonations: donationOverview.totalDonationCount, totalRecentDonations: donationOverview.totalRecentDonationCount };
        setDonationOverview(overviewList);
        setHello(hello);
    }

    const getAllDonations = async (fundraiserId) => {
        const donations = await getAllDonationsByFundraiserId(fundraiserId);
        console.log(donations);
        setAllDonations(donations);
    }

    const donorTypes = ["Recent donor", "Top donor", "First donor"];

    useEffect(() => {
        // setActiveLoading(true);
        if (allFundraisers.length > 0) {
            const active = allFundraisers[activeIndex];
            setActiveFundraiser(active);
            getDonationOverview(active.id);
            getAllDonations(active.id);
        }
        setTimeout(() => {
            setActiveLoading(false);
        }, 800);
    }, [allFundraisers, activeIndex])

    useEffect(() => {
        // console.log(allFundraisers);
    }, [])

    const getImageUrl = (myfile) => {
        if (myfile) {
            const imageUrl = `data:${myfile.fileContentType};base64,${myfile.fileData}`;
            return imageUrl;
        }
    }

    const getAngle = (progress) => {
        return Math.min(100, Math.max(0, progress)) * 3.6;
    }

    const timesAgo = (date) => {
        try {
            const now = new Date();
            const seconds = Math.floor((now - new Date(date)) / 1000);

            let interval = Math.floor(seconds / 31536000); // seconds in a year
            if (interval >= 1) return interval + (interval === 1 ? " year ago" : " years ago");

            interval = Math.floor(seconds / 2592000); // seconds in a month
            if (interval >= 1) return interval + (interval === 1 ? " month ago" : " months ago");

            interval = Math.floor(seconds / 86400); // seconds in a day
            if (interval >= 1) return interval + (interval === 1 ? " day ago" : " days ago");

            interval = Math.floor(seconds / 3600); // seconds in an hour
            if (interval >= 1) return interval + (interval === 1 ? " hour ago" : " hours ago");

            interval = Math.floor(seconds / 60); // seconds in a minute
            if (interval >= 1) return interval + (interval === 1 ? " minute ago" : " minutes ago");

            return seconds + (seconds === 1 ? " second ago" : " seconds ago");
        } catch (error) {
            return (' ');
        }

    }

    const handleShare = async () => {
        try {
            const url = activeFundraiser ? `http://localhost:3000/fundraiser/${activeFundraiser.slug}` : '';

            await navigator.clipboard.writeText(url);

            setShareInfo('URL copied to clipboard!');
            setTimeout(() => {
                setShareInfo('');
            }, 2000);
        } catch (err) {
            setShareInfo('Failed to copy URL!');
            setTimeout(() => {
                setShareInfo('');
            }, 2000);
        }
    };

    const handlePrevNext = (btn) => {
        if (btn === 'prev') {
            if (activeIndex <= 0) {
                setActiveIndex(allFundraisers.length - 1);
            } else {
                setActiveIndex(activeIndex - 1);
            }
        }
        if (btn === 'next') {
            if (activeIndex >= allFundraisers.length - 1) {
                setActiveIndex(0);
            } else {
                setActiveIndex(activeIndex + 1);
            }
        }
    }

    return (
        <>
            <div className="oc-overview-container">
                <div className="oc-overview-header">
                    <h1 className="oc-overview-title">Welcome, {user.name}</h1>
                    <p className="oc-overview-text">Where insights meet action — empowering your journey.</p>
                </div>
                <ul className="oc-overview-cards-container">
                    <li className="oc-overview-card">
                        <div className="oc-overview-card-details">
                            <span className="oc-overview-card-title">Total Fundraisers <MdCampaign style={{ fontSize: "1.6rem" }} /></span>
                            <span className="oc-overview-card-text">Number of fundraisers that you created.</span>
                        </div>
                        <div className="oc-overview-card-count"><span>{overview.totalFundraisers}</span></div>
                    </li>
                    <li className="oc-overview-card">
                        <div className="oc-overview-card-details">
                            <span className="oc-overview-card-title">Total Donations <BiSolidDonateHeart style={{ fontSize: "1.6rem" }} /></span>
                            <span className="oc-overview-card-text">Number of donations that you made here.</span>
                        </div>
                        <div className="oc-overview-card-count"><span>{overview.totalDonations}</span></div>
                    </li>
                </ul>

                <div className="oc-overview-active">
                    <div className="oc-overview-active-header">
                        <h2 className="oc-overview-active-title">Active Fundraisers Overview</h2>
                        {(activeFundraiser && allFundraisers.length > 1) && <div className="oc-overview-active-buttons">
                            <button type="button" className='oc-prev-next-btn' onClick={(e) => { handlePrevNext('prev') }}><FaChevronCircleLeft /></button>
                            <button type="button" className='oc-prev-next-btn' onClick={(e) => { handlePrevNext('next') }}><FaChevronCircleRight /></button>
                        </div>}
                    </div>
                    {activeLoading ? <div className="oc-loading">
                        <MoonLoader size={100} color='var(--btn-secondary)' />
                    </div> : (
                        activeFundraiser ? <div className="oc-overview-active-content">
                            <div className="oc-fundraiser-detials">
                                <picture className="oc-details-left">
                                    <Image className='oc-details-left-image' src={getImageUrl(activeFundraiser.photo)} width={300} height={200} priority alt="fundraiser-cover-image" />
                                </picture>
                                <div className="oc-details-right">
                                    <Link href={`/fundraisers/${activeFundraiser.slug}`} className="oc-fundraiser-title">{activeFundraiser.title}</Link>
                                    <p className="oc-fundraiser-text">{activeFundraiser.description.slice(0, 150)}...</p>
                                </div>
                            </div>

                            <div className="oc-fundraiser-overview-container">
                                <div className="oc-fundraiser-progress">
                                    <div className="circle" style={{ '--progress': `${getAngle(activeFundraiser.progress)}deg` }} />
                                    <div className="innerCircle" />
                                    <div className="progressText">{activeFundraiser.progress}% <span>progress</span></div>
                                </div>
                                <div className="oc-fundraiser-goal-details">
                                    <span className="oc-fundraiser-goal-amount">Rs.{activeFundraiser.goal}</span>
                                    <span className='oc-fundraiser-goal-text'><GoGoal style={{fontSize: "1.4rem"}}/>Goal</span>
                                </div>
                                <div className="oc-fundraiser-donation-ac-card">
                                    <span className="oc-fundraiser-donation-ac-icon1">NRS</span>
                                    <span className="oc-fundraiser-donation-ac-text">{activeFundraiser.totalDonationAmount}</span>
                                    <span className="oc-fundraiser-donation-ac-title">Fund Raised Yet</span>
                                </div>
                                <div className="oc-fundraiser-donation-ac-card">
                                    <span className="oc-fundraiser-donation-ac-icon2"><BiSolidDonateHeart /></span>
                                    <span className="oc-fundraiser-donation-ac-text">{hello ? hello.totalDonations : "0"}</span>
                                    <span className="oc-fundraiser-donation-ac-title">Total Donations</span>
                                </div>
                            </div>

                            <div className="oc-fundraiser-donor-details">
                                <div className="oc-donor-overview">
                                    <h3 className="oc-donor-overview-title">Donation Overview</h3>
                                    {(donationOverview.length > 0 && donationOverview[0]) ? <ul className="oc-donor-overview-list">
                                        {donationOverview.map((donation, index) => {
                                            return (
                                                donation && <li key={index} className="oc-box-types-item">
                                                    <div className="oc-comments-item-icon"><BiDonateHeart /></div>
                                                    <div className="oc-types-item-details">
                                                        <div className="oc-types-item-name">{donation.user.name}</div>
                                                        <div className="oc-types-item-amount-type">
                                                            <span className="oc-types-item-amount">Rs{donation.donationAmount}</span>
                                                            <span className="oc-type-item-type">--- {donorTypes[index]}</span>
                                                        </div>
                                                    </div>
                                                </li>
                                            )
                                        })}
                                    </ul> : <div className="oc-overview-active-empty1">
                                        {/* <span className='oc-no-donation-title'>No donations yet!</span> */}
                                        <button className="oc-details-sd-btn" onClick={(e) => { handleShare(''); }}>
                                            {shareInfo != '' && <span className="oc-sd-btn-info">{shareInfo}</span>}
                                            <div className="oc-details-sd-icon"><GoCopy /></div> Copy link
                                        </button>
                                        <span className="oc-no-dontaion-text">Share this fundraiser to reach donors.</span>
                                    </div>}
                                </div>
                                <div className="oc-donor-overview oc-all-donor-list-cont">
                                    <h3 className="oc-donor-overview-title">All Donations Details</h3>
                                    {allDonations.length > 0 ? <ul className="oc-donor-overview-list oc-all-donor-list">
                                        {allDonations.map((donation, index) => {
                                            return (
                                                donation && <li key={index} className="oc-box-types-item oc-all-donor-listitems">
                                                    <div className="oc-comments-item-icon"><BiDonateHeart /></div>
                                                    <div className="oc-types-item-details">
                                                        <div className="oc-types-item-name">{donation.user.name}</div>
                                                        <div className="oc-types-item-amount-type">
                                                            <span className="oc-types-item-amount">Rs{donation.donationAmount}</span>
                                                            <span className="oc-type-item-type">--- {timesAgo(donation.dateDonated)}</span>
                                                        </div>
                                                    </div>
                                                </li>
                                            )
                                        })}
                                    </ul> : <div className="oc-overview-active-empty2">
                                        <span className='oc-no-donation-title'>No donations yet!</span>
                                        <span className='oc-no-donation-text'>All the donations to this fundraiser will appear here.</span>
                                    </div>}
                                </div>
                            </div>

                        </div> : <div className="fs-fundraisers-empty">
                            <span className='fs-no-fundraisers-title'>No active fundraisers!</span>
                            <span className='fs-no-fundraisers-text'>Click the button below to create a fundraiser here.</span>
                            <Link href={"/getstarted"} className="oc-get-started-btn">
                                <span>Get Started</span>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default Overview
