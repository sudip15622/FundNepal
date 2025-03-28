"use client"
import React, { useState, useEffect } from 'react'
import "./Fundraiser.css";
import Image from 'next/image';
import Link from 'next/link';
import DonationPage from './DonationPage/DonationPage';
import ReportPage from './DonationPage/ReportPage';
import { useSearchParams, useRouter } from 'next/navigation';
import { PulseLoader } from 'react-spinners';

import { FaUserCircle, FaAngleDown, FaAngleUp } from "react-icons/fa";
import { IoShieldCheckmark } from "react-icons/io5";
import { LiaDonateSolid } from "react-icons/lia";
import { MdOutlineShare, MdOutlineEmail } from "react-icons/md";
import { FaArrowRightLong } from "react-icons/fa6";
import { BiDonateHeart } from "react-icons/bi";
import { FiFlag } from "react-icons/fi";
import { HiMiniBarsArrowUp, HiMiniBarsArrowDown } from "react-icons/hi2";
import { IoIosStarOutline } from "react-icons/io";
import { GoCopy } from "react-icons/go";
import { FaLocationDot } from "react-icons/fa6";

const Fundraiser = ({ details, user, donations }) => {

    const router = useRouter();
    const searchParams = useSearchParams();

    const page = searchParams.get('page') || '';

    const [validPage, setValidPage] = useState(false);

    const [showMore, setShowMore] = useState(false);
    const [shareInfo, setShareInfo] = useState('');
    const [shareBoxInfo, setShareBoxInfo] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (page == 'donation' || page == 'report') {
            setValidPage(true);
        } else {
            setValidPage(false);
        }
    }, []);

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
            const street = contactInfo[0].address.street;
            return `${street}, ${city}-${wardNo}, ${district}`;
        }
    }
    const handleShare = async (key) => {
        try {
            const currentUrl = window.location.href;

            await navigator.clipboard.writeText(currentUrl);

            key === 'box' ? setShareBoxInfo('URL copied to clipboard') : setShareInfo('URL copied to clipboard');

            setTimeout(() => {
                setShareInfo('');
                setShareBoxInfo('');
            }, 2000);
        } catch (err) {
            key === 'box' ? setShareBoxInfo('Failed to copy URL!') : setShareInfo('Failed to copy URL!');
            setTimeout(() => {
                setShareInfo('');
                setShareBoxInfo('');
            }, 2000);
        }
    };

    const handleDonateClick = () => {
        if (isLoading) {
            return;
        }
        setIsLoading(true);
        if (!user) {
            router.push(`/signin?redirectTo=/fundraisers/${details.slug}?page=donation`);
            setIsLoading(false);
            return;
        }

        router.push(`/fundraisers/${details.slug}?page=donation`);
        setIsLoading(false);
    }

    const handleReportFundraiser = () => {
        if (!user) {
            router.push(`/signin?redirectTo=/fundraisers/${details.slug}?page=report`);
            return;
        }
        router.push(`/fundraisers/${details.slug}?page=report`);
    }

    return (
        page === 'donation' ? <DonationPage details={details} user={user} /> : (
            page === 'report' ? <ReportPage user={user} details={details}/> : (
                <div className='ff-fundraiser-container'>
                    <main className='ff-fundraiser-details-cont'>
                        <h1 className="ff-fundraiser-details-title">
                            {details.title}
                        </h1>
                        <picture className='ff-fundraiser-cover-cont'>
                            <Image className='ff-fundraiser-cover-image' src={getImageUrl(details.photo)} width={600} height={500} alt={`image-${details.id}`} />
                        </picture>

                        <div className="ff-below-contents">
                            <p className="ff-who-organizing-text">
                                <span className='ff-address-icon'><FaLocationDot /></span> {getAddress(details.beneficiary)}
                            </p>

                            <div className="ff-details-separator-line"></div>

                            <div className="ff-donation-protected">
                                <div className="ff-protected-icon"><IoShieldCheckmark />
                                </div>
                                <div className="ff-protected-text">Donation Protected</div>
                            </div>

                            <div className="ff-details-separator-line"></div>

                            <div className="ff-details-description-cont">
                                <p className="ff-details-desc">
                                    {!showMore && <span className="ff-desc-bottom-shadow"></span>}
                                    {showMore ? details.description : details.description.slice(0, 200)}
                                </p>
                                {details.description.length > 200 && <button className="ff-desc-read-more" onClick={(e) => { setShowMore(!showMore) }}>
                                    <div className="ff-readmore-text">{showMore ? "Read less" : "Read more"}</div>
                                    <div className="ff-readmore-icon">{showMore ? <FaAngleUp /> : <FaAngleDown />}</div>
                                </button>}
                            </div>

                            <div className="ff-details-share-donate">
                                <button className="ff-details-sd-btn" onClick={(e) => { handleDonateClick(); }}>
                                    <div className="ff-details-sd-icon"><LiaDonateSolid /></div> Donate
                                </button>
                                <button className="ff-details-sd-btn" onClick={(e) => { handleShare(''); }}>
                                    {shareInfo != '' && <span className="ff-sd-btn-info">{shareInfo}</span>}
                                    <div className="ff-details-sd-icon"><GoCopy /></div> Copy link
                                </button>
                            </div>

                            <div className="ff-details-separator-line"></div>

                            <div className="ff-organizer-and-beneficiary">
                                <h2 className="ff-organizer-beneficiary-title">
                                    Organizer {details.user.name !== details.beneficiary[0].name && "and Beneficiary"}
                                </h2>
                                <div className="ff-organizer-beneficiary-cont">
                                    <div className="ff-organizer-cont">
                                        {details.user.avatar ? <picture className="ff-user-avatar-image-cont">
                                            <Image className='ff-user-avatar-image' src={details.user.avatar} width={50} height={45} alt="user-avatar" />
                                        </picture> : <div className="ff-organizer-icon"><FaUserCircle /></div>}
                                        <div className="ff-organizer-text">
                                            <div className="ff-organizer-name">{details.user.name}</div>
                                            <div className="ff-organizer-address">Organizer</div>
                                            {/* <button className="ff-organizer-contact-btn">
                                                <div className="ff-organizer-contact-icon"><MdOutlineEmail /></div> Contact
                                            </button> */}
                                        </div>
                                    </div>

                                    {details.user.name !== details.beneficiary[0].name && <>
                                        <div className="ff-ob-mid-arrow"><FaArrowRightLong /></div>

                                        <div className="ff-organizer-cont">
                                            <div className="ff-organizer-icon"><FaUserCircle /></div>
                                            <div className="ff-organizer-text">
                                                <div className="ff-organizer-name">{details.beneficiary[0].name}</div>
                                                <div className="ff-organizer-address">Beneficiary</div>
                                            </div>
                                        </div>
                                    </>}
                                </div>
                            </div>

                            {/* <div className="ff-details-separator-line"></div>

                    <div className="ff-details-comments">
                        <h2 className="ff-organizer-beneficiary-title">
                            Words of Support (20)
                        </h2>
                        <p className="ff-comments-info">Please donate to share your words of support.</p>

                        <ul className="ff-details-comments-container">
                            <li className="ff-comments-item">
                                <div className="ff-comments-item-icon"><BiDonateHeart /></div>
                                <div className="ff-comments-details">
                                    <div className="ff-commentator-name">Sudip Lamichhane</div>
                                    <div className="ff-commentator-amount-date"> Rs.500 --- 3 d</div>
                                    <p className="ff-commentator-comment">Hey, best of luck for your further study. Just do it with your own. If you need any more help then you can reach me through here.</p>
                                </div>
                            </li>
                            <li className="ff-comments-item">
                                <div className="ff-comments-item-icon"><BiDonateHeart /></div>
                                <div className="ff-comments-details">
                                    <div className="ff-commentator-name">Maddath Subedi</div>
                                    <div className="ff-commentator-amount-date"> Rs.300 --- 5 d</div>
                                    <p className="ff-commentator-comment">Hey, best of luck for your further study. Just do it with your own. If you need any more help then you can reach me through here.</p>
                                </div>
                            </li>
                        </ul>
                    </div> */}

                            <div className="ff-details-separator-line"></div>

                            <div className="ff-details-category-info">
                                <div className="ff-details-published-date">Published {timesAgo(details.datePublished)} ---</div>
                                <Link href={`/categories/${details.category.replace(/\s+/g, '').toLowerCase()}`}>{details.category}</Link>
                            </div>

                            <div className="ff-details-separator-line"></div>

                            <button className="ff-details-report-section" onClick={(e) => { handleReportFundraiser() }}>
                                <div className="ff-report-icon"><FiFlag /></div>
                                <div className="ff-report-text">Report fundraiser</div>
                            </button>

                        </div>
                    </main>
                    <aside className="ff-fundraiser-donate-box">
                        <div className="ff-donate-box-first">
                            <div className="ff-box-goal-and-amount">
                                <span className='ff-box-raised-amount'>Rs.{details.totalDonationAmount}</span>
                                {details.progress < 100 ? <span className='ff-box-goal-amount'>raised of Rs.{details.goal} goal</span> : <span className='ff-box-goal-amount'>raised ( Goal Completed )</span>}
                            </div>
                            <div className="ff-box-progress">
                                <div className="ff-box-progress-bar" style={{ width: `${details.progress}%` }}></div>
                            </div>
                            <span className="ff-box-total-donation">
                                {donations.totalDonationCount} {donations.totalDonationCount > 1 ? 'donations' : 'donation'}
                            </span>
                        </div>

                        <div className="ff-donate-box-buttons">
                            {shareBoxInfo != '' && <span className="ff-sd-btn-info">{shareBoxInfo}</span>}
                            <button className="ff-box-button ff-box-share-btn" onClick={(e) => { handleShare('box'); }}>
                                <span>Copy link</span>
                            </button>
                            <button className="ff-box-button ff-box-donate-btn" onClick={(e) => { handleDonateClick(); }}>
                                <span>{isLoading ? <PulseLoader size={10} margin={4} /> : `Donate Now`}</span>
                            </button>
                        </div>

                        <div className="ff-donate-box-latest-donation">
                            <div className="ff-box-latest-icon">{donations.totalRecentDonationCount < 1 ? <HiMiniBarsArrowDown /> : <HiMiniBarsArrowUp />}</div>
                            {donations.totalRecentDonationCount < 1 ? <div className="ff-box-latest-text">No recent donation</div> : <div className="ff-box-latest-text">{donations.totalRecentDonationCount} {donations.totalRecentDonationCount > 1 ? 'people' : 'person'} just donated</div>}
                        </div>

                        {donations.firstDonation ? <ul className="ff-donate-box-donator-types">
                            <li className="ff-box-types-item">
                                <div className="ff-comments-item-icon"><BiDonateHeart /></div>
                                <div className="ff-types-item-details">
                                    <div className="ff-types-item-name">{donations.recentDonation.user.name}</div>
                                    <div className="ff-types-item-amount-type">
                                        <span className="ff-types-item-amount">Rs.{donations.recentDonation.donationAmount}</span>
                                        <span className="ff-type-item-type">--- Recent donation</span>
                                    </div>
                                </div>
                            </li>
                            <li className="ff-box-types-item">
                                <div className="ff-comments-item-icon"><BiDonateHeart /></div>
                                <div className="ff-types-item-details">
                                    <div className="ff-types-item-name">{donations.topDonation.user.name}</div>
                                    <div className="ff-types-item-amount-type">
                                        <span className="ff-types-item-amount">Rs.{donations.topDonation.donationAmount}</span>
                                        <span className="ff-type-item-type">--- Top donation</span>
                                    </div>
                                </div>
                            </li>
                            <li className="ff-box-types-item">
                                <div className="ff-comments-item-icon"><BiDonateHeart /></div>
                                <div className="ff-types-item-details">
                                    <div className="ff-types-item-name">{donations.firstDonation.user.name}</div>
                                    <div className="ff-types-item-amount-type">
                                        <span className="ff-types-item-amount">Rs.{donations.firstDonation.donationAmount}</span>
                                        <span className="ff-type-item-type">--- First donation</span>
                                    </div>
                                </div>
                            </li>
                        </ul> : <div className="ff-become-first-donator">
                            <div className="ff-first-donator-icon"><BiDonateHeart /></div>
                            <div className="ff-first-donator-text">Be the first to donate</div>
                        </div>}

                        {/* <div className="ff-donate-box-last-buttons">
                    <button className="ff-box-last-btns">See all</button>
                    <button className="ff-box-last-btns"><span><IoIosStarOutline /></span>See top</button>
                </div> */}
                    </aside>
                </div>
            )
        )
    )
}

export default Fundraiser
