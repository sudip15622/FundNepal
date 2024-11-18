"use client"
import React, { useState, useEffect, useRef } from 'react'
import "./Donations.css"
import { MoonLoader } from 'react-spinners';
import Link from 'next/link';
import Image from 'next/image';

import { BiSolidDonateHeart, BiDonateHeart } from "react-icons/bi";
import { IoClose } from "react-icons/io5";

const Donations = ({ user, allDonations }) => {

    const [listLoading, setListLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const [animatePopup, setAnimatePopup] = useState(false);
    const [currentDetails, setCurrentDetails] = useState(null);
    const popupRef = useRef(null);

    useEffect(() => {
        setListLoading(false);
    }, [])

    useEffect(() => {
        function handleClickOutside(event) {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                handleHideClick();
            }
        }
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };

    }, [showPopup]);

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

    const manageBtnClick = (index) => {
        setAnimatePopup(false);
        setShowPopup(true);
        setCurrentDetails(allDonations[index]);
    }

    const handleHideClick = () => {
        setAnimatePopup(true);
        setTimeout(() => {
            setShowPopup(false);
            setCurrentDetails(null);
            setAnimatePopup(false);
        }, 200);
    }

    const getImageUrl = (myfile) => {
        if (myfile) {
            const imageUrl = `data:${myfile.fileContentType};base64,${myfile.fileData}`;
            return imageUrl;
        }
    }

    return (
        <div className='ds-donations-container'>
            <div className="ds-fundraisers-header">
                <h1 className="ds-fundraisers-title">Your Donations</h1>
                <p className="ds-fundraisers-text">Here you can view all donations you made and their details.</p>
            </div>

            {listLoading ? <div className="ds-loading">
                <MoonLoader size={100} color='var(--btn-secondary)' />
            </div> : (
                (allDonations && allDonations.length > 0) ? (
                    <ul className="ds-donations-lists">
                        {allDonations.map((donation, index) => {
                            return (
                                <li key={donation.id} className="ds-donations-listitem">
                                    <div className="ds-donation-left">
                                        <div className="ds-donation-icon"><BiSolidDonateHeart /></div>
                                        <div className="ds-donation-amount">Rs.{donation.donationAmount}</div>
                                    </div>
                                    <div className="ds-donation-right">
                                        <Link href={`/fundraisers/${donation.fundraiser.slug}`} className="ds-donation-title">To: {donation.fundraiser.title}</Link>
                                        <div className="ds-donation-view-date">
                                            <button type="button" className='ds-donation-manage-btn' onClick={(e) => { manageBtnClick(index) }}>View Details</button>
                                            <div className="ds-donation-date">{timesAgo(donation.dateDonated)}</div>
                                        </div>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                ) : (
                    <div className="ds-donations-empty">
                        <h1 className="ds-donations-empty-title">No Donations found</h1>
                        <p className="ds-donations-empty-text">You have not donated any fundraisers yet. Browse various fundraiser and support them.</p>
                        <Link href={"/donate"} className="ds-get-started-btn">
                            <span>Donate</span>
                        </Link>
                    </div>
                )
            )}

            {showPopup && <div className={`ds-manage-overlay ${animatePopup && "ds-overlay-hide"}`}>
                {currentDetails && <div ref={popupRef} className={`ds-manage-popup ${animatePopup && "ds-popup-hide"}`}>
                    <button className="ds-hide-popup-btn" onClick={(e) => { handleHideClick(); }}><IoClose /></button>
                    <div className="ds-view-donation-details">
                        <h2 className="ds-popup-title">Donation Details:</h2>
                        <ul className="ds-donation-details-list">
                            <li className="ds-donation-fundraiser">
                                <Link href={`/fundraisers/${currentDetails.fundraiser.slug}`}>
                                    <picture className="ds-donation-fundraiser-cover">
                                        <Image className='ds-donation-fundraiser-image' src={getImageUrl(currentDetails.fundraiser.photo)} width={150} height={80} alt="fundraiser-cover" />
                                    </picture>
                                    <div className="ds-donation-fundraiser-details">
                                        <h3 className="ds-donation-fundraiser-title">{currentDetails.fundraiser.title}</h3>
                                        <p className="ds-donation-fundraiser-text">You have supported this fundraiser with Rs.{currentDetails.donationAmount}</p>
                                    </div>
                                </Link>
                            </li>
                            <li className="ds-donation-details-listitem ds-listitem-first">
                                <span className="ds-donation-details-key">Donation Amount:</span>
                                <span className="ds-donation-details-value">Rs.{currentDetails.donationAmount}</span>
                            </li>
                            <li className="ds-donation-details-listitem ds-listitem-first">
                                <span className="ds-donation-details-key">Service Charge:</span>
                                <span className="ds-donation-details-value">Rs.{currentDetails.serviceCharge}</span>
                            </li>
                            <li className="ds-donation-details-listitem ds-listitem-first">
                                <span className="ds-donation-details-key">Total Amount:</span>
                                <span className="ds-donation-details-value">Rs.{currentDetails.totalAmount}</span>
                            </li>
                        </ul>

                        <div className="ds-donation-line"></div>

                        <h2 className="ds-popup-title2">Transaction Details:</h2>

                        <ul className="ds-transaction-details-list">
                            <li className="ds-donation-details-listitem">
                                <span className="ds-donation-details-key">Payment Method:</span>
                                <span className="ds-donation-details-value">{currentDetails.paymentMethod}</span>
                            </li>
                            <li className="ds-donation-details-listitem">
                                <span className="ds-donation-details-key">pidx:</span>
                                <span className="ds-donation-details-value">{currentDetails.pidx}</span>
                            </li>
                            <li className="ds-donation-details-listitem">
                                <span className="ds-donation-details-key">Status:</span>
                                <span className="ds-donation-details-value">{currentDetails.status}</span>
                            </li>
                            <li className="ds-donation-details-listitem">
                                <span className="ds-donation-details-key">Purchase Order Id:</span>
                                <span className="ds-donation-details-value">{currentDetails.purchase_order_id}</span>
                            </li>
                            <li className="ds-donation-details-listitem">
                                <span className="ds-donation-details-key">Purchase Order Name:</span>
                                <span className="ds-donation-details-value">{currentDetails.purchase_order_name}</span>
                            </li>
                            <li className="ds-donation-details-listitem">
                                <span className="ds-donation-details-key">Transaction Id:</span>
                                <span className="ds-donation-details-value">{currentDetails.transaction_id}</span>
                            </li>
                            <li className="ds-donation-details-listitem">
                                <span className="ds-donation-details-key">Total Amount:</span>
                                <span className="ds-donation-details-value">Rs.{currentDetails.totalAmount}</span>
                            </li>
                        </ul>
                    </div>
                </div>}
            </div>}
        </div>
    )
}

export default Donations
