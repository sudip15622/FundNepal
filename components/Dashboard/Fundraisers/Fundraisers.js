"use client"
import React, { useState, useEffect, useRef } from 'react'
import "./Fundraisers.css";
import Image from 'next/image';
import Link from 'next/link';
import { MoonLoader } from 'react-spinners';
import { getFundraiserByUserId, getFundraiserById } from '@/actions/getFundraisers';
import EditBox from './EditBox';

import { BiSolidDonateHeart, BiDonateHeart } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { IoArrowBack } from "react-icons/io5";

const Fundraisers = ({ user }) => {

    const [allFundraisers, setAllFundraisers] = useState([]);
    const [currentDetails, setCurrentDetails] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [nowEditing, setNowEditing] = useState(null);
    const [animatePopup, setAnimatePopup] = useState(false);
    const [isDataSaved, setIsDataSaved] = useState(false);

    const [listLoading, setListLoading] = useState(true);
    const [currentId, setCurrentId] = useState(null);

    const popupRef = useRef(null);

    const getAllFundraiser = async (userId) => {
        // setListLoading(true);
        const fundraisers = await getFundraiserByUserId(userId);
        setAllFundraisers(fundraisers);
        setTimeout(() => {
            setListLoading(false);
        }, 200);
    }

    const getCurrentDetails = async (fundraiserId) => {
        const details = await getFundraiserById(fundraiserId);
        if (details) {
            setCurrentDetails(details);
        }
    }

    useEffect(() => {
        if (user) {
            getAllFundraiser(user.id);
        }
    }, [user, showPopup, isDataSaved]);

    useEffect(() => {
        if (currentId) {
            getCurrentDetails(currentId);
        } else {
            setCurrentDetails(null);
        }
    }, [currentId, showEdit, isDataSaved]);

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

    // const getFundraiserDetails

    const getImageUrl = (myfile) => {
        if (myfile) {
            const imageUrl = `data:${myfile.fileContentType};base64,${myfile.fileData}`;
            return imageUrl;
        }
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

    const manageBtnClick = (fundraiserId) => {
        setAnimatePopup(false);
        setShowPopup(true);
        setCurrentId(fundraiserId);
        // setShowEdit(false);
        // setNowEditing(null);
    }
    const handleHideClick = () => {
        setAnimatePopup(true);
        setTimeout(() => {
            setShowPopup(false);
            setCurrentDetails(null);
            setCurrentId(null);
            setAnimatePopup(false);
            setShowEdit(false);
            setNowEditing(null);
        }, 300);
    }

    const handleEditClick = (key, value) => {
        setShowEdit(true);

        const myObject = {
            key: key,
            value: value,
        }
        setNowEditing(myObject);
    }

    const sendObject = {
        setShowEdit: setShowEdit,
        setNowEditing: setNowEditing,
        setIsDataSaved: setIsDataSaved,
    }

    const getAddress = (contactInfo) => {
        if (contactInfo) {
            const wardNo = contactInfo[0].address.wardNo;
            const city = contactInfo[0].address.city;
            const district = contactInfo[0].address.district;
            const street = contactInfo[0].address.street;
            return `${street}-${wardNo}, ${city}, ${district}`;
        }
    }

    return (
        <>
            <div className="fs-fundraisers-container">
                <div className="fs-fundraisers-header">
                    <h1 className="fs-fundraisers-title">Your Fundraisers</h1>
                    <p className="fs-fundraisers-text">Here you can view and manage all your fundraisers.</p>
                </div>

                {listLoading ? <div className="fs-loading">
                    <MoonLoader size={100} color='var(--btn-secondary)' />
                </div> : (
                    (allFundraisers && allFundraisers.length > 0) ? (
                        <ul className="fs-fundraisers-lists">
                            {allFundraisers.map((fundraiser, index) => {
                                return (
                                    <li key={fundraiser.id} className="fs-fundraisers-listitems">
                                        <picture className="fs-fundraiser-cover">
                                            <Image className='fs-fundraiser-cover-image' src={getImageUrl(fundraiser.photo)} width={300} height={200} alt="fundraiser-cover" />
                                        </picture>
                                        <div className="fs-fundraiser-details">
                                            <div className="fs-fundraiser-details-up">
                                                <Link href={`/fundraisers/${fundraiser.slug}`} className="fs-fundraiser-title">{fundraiser.title}</Link>
                                                <div className="fs-fundraiser-donation-progress">
                                                    <div className="fs-fundraiser-progress-details">
                                                        <div className="fs-fundraiser-progress">
                                                            <div className="fs-fundraiser-progress-bar" style={{ width: `${fundraiser.progress}%` }}></div>
                                                        </div>
                                                        <div className="fs-fundraiser-amount-goal">
                                                            <span>Rs.{fundraiser.totalDonationAmount}</span> raised of Rs.{fundraiser.goal} ({fundraiser.progress}%)
                                                        </div>
                                                    </div>
                                                    {/* <div className="fs-fundraiser-donation">
                                                        <div className="fs-fundraiser-donation-icon"><BiSolidDonateHeart /></div>
                                                        <div className="fs-fundraiser-donation-count">3</div>
                                                    </div> */}
                                                </div>
                                            </div>
                                            <div className="fs-fundraiser-manage-date">
                                                <button type="button" className='fs-fundraiser-manage-btn' onClick={(e) => { manageBtnClick(fundraiser.id) }}>Manage Details</button>
                                                <div className="fs-fundraiser-date">{timesAgo(fundraiser.datePublished)}</div>
                                            </div>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    ) : (
                        <div className="fs-fundraisers-empty">
                            <h1 className="fs-fundraisers-empty-title">No fundraisers found</h1>
                            <p className="fs-fundraisers-empty-text">You have not created any fundraisers yet. Click the button below to create your first fundraiser.</p>
                            <Link href={"/getstarted"} className="fs-get-started-btn">
                                <span>Get Started</span>
                            </Link>
                        </div>
                    )
                )}

                {showPopup && <div className={`fs-manage-overlay ${animatePopup && "fs-overlay-hide"}`}>
                    {currentDetails && <>
                        <div ref={popupRef} className={`fs-manage-popup ${animatePopup && "fs-popup-hide"}`}>
                            <button className="fs-hide-popup-btn" onClick={(e) => { handleHideClick(); }}><IoClose /></button>
                            {(showEdit && nowEditing) ? <><EditBox nowEditing={nowEditing} id={{fundraiserId: currentDetails.id, beneficiaryId: currentDetails.beneficiary[0].id}} setStates={sendObject} /></> : <ul className="fs-manage-popup-content">
                                <h2 className="fs-popup-title">Fundraiser Details:</h2>
                                <li className="fs-preview-item">
                                    <div className="fs-title-field">
                                        <h3 className="fs-item-title">Cover Image</h3>
                                        <button className='fs-edit-btn' onClick={(e) => { handleEditClick('photo', null) }}>Change</button>
                                    </div>
                                    <picture>
                                        <Image className='fs-preview-photo' src={getImageUrl(currentDetails.photo)} width={400} height={300} alt="" />
                                    </picture>
                                </li>

                                <li className="fs-preview-item">
                                    <div className="fs-title-field">
                                        <h3 className="fs-item-title">Title</h3>
                                        <button className='fs-edit-btn' onClick={(e) => { handleEditClick('title', currentDetails.title) }}>Edit</button>
                                    </div>
                                    <p className="fs-item-desc">{currentDetails.title}</p>
                                </li>

                                <li className="fs-preview-line"></li>

                                <li className="fs-preview-item">
                                    <div className="fs-title-field">
                                        <h3 className="fs-item-title">Starting Goal</h3>
                                        <button className='fs-edit-btn' onClick={(e) => { handleEditClick('goal', currentDetails.goal) }}>Edit</button>
                                    </div>
                                    <p className="fs-item-desc">Rs. {currentDetails.goal}</p>
                                </li>

                                <li className="fs-preview-line"></li>

                                <li className="fs-preview-item">
                                    <div className="fs-title-field">
                                        <h3 className="fs-item-title">Category</h3>
                                        <button className='fs-edit-btn' onClick={(e) => { handleEditClick('category', currentDetails.category) }}>Change</button>
                                    </div>
                                    <p className="fs-item-desc">{currentDetails.category}</p>
                                </li>

                                <li className="fs-preview-line"></li>

                                <li className="fs-preview-item">
                                    <div className="fs-title-field">
                                        <h3 className="fs-item-title">Fundraising for</h3>
                                        <button className='fs-edit-btn' onClick={(e) => { handleEditClick('type', currentDetails.type) }}>Change</button>
                                    </div>
                                    <p className="fs-item-desc">{currentDetails.type}</p>
                                </li>

                                <li className="fs-preview-line"></li>

                                <li className="fs-preview-item">
                                    <div className="fs-title-field">
                                        <h3 className="fs-item-title">Description</h3>
                                        <button className='fs-edit-btn' onClick={(e) => { handleEditClick('description', currentDetails.description) }}>Edit</button>
                                    </div>
                                    <p className="fs-item-desc fs-desc-box">{currentDetails.description.slice(0, 200)}......</p>
                                </li>

                                <h2 className="fs-popup-title2">Beneficiary Details:</h2>

                                <li className="fs-preview-item">
                                    <div className="fs-title-field">
                                        <h3 className="fs-item-title">Full Name</h3>
                                        <button className='fs-edit-btn' onClick={(e) => { handleEditClick('name', currentDetails.beneficiary[0].name) }}>Edit</button>
                                    </div>
                                    <p className="fs-item-desc fs-desc-box">{currentDetails.beneficiary[0].name}</p>
                                </li>

                                <li className="fs-preview-line"></li>

                                <li className="fs-preview-item">
                                    <div className="fs-title-field">
                                        <h3 className="fs-item-title">Phone Number</h3>
                                        <button className='fs-edit-btn' onClick={(e) => { handleEditClick('phone', currentDetails.beneficiary[0].phone) }}>Edit</button>
                                    </div>
                                    <p className="fs-item-desc fs-desc-box">{currentDetails.beneficiary[0].phone}</p>
                                </li>

                                <li className="fs-preview-line"></li>

                                <li className="fs-preview-item">
                                    <div className="fs-title-field">
                                        <h3 className="fs-item-title">Address</h3>
                                        <button className='fs-edit-btn' onClick={(e) => { handleEditClick('address', currentDetails.beneficiary[0].address) }}>Edit</button>
                                    </div>
                                    <p className="fs-item-desc fs-desc-box">{getAddress(currentDetails.beneficiary)}</p>
                                </li>
                            </ul>}
                        </div>
                    </>}
                </div>}
            </div>

        </>
    )
}

export default Fundraisers
